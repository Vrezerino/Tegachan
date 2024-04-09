import { getMongoDb as db } from '@/app/lib/mongodb';
import { newPostSchema } from '@/app/lib/newPostSchema';
import { NewPostType } from '@/app/lib/definitions';
import { isErrorWithStatusCodeType } from '@/app/lib/utils';

import s3 from '@/aws.config';
import { Upload } from '@aws-sdk/lib-storage';
import { AWS_NAME, AWS_URL } from '../../lib/env';

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const getLatestPosts = async () => {
    // Get twenty latest posts from all boards
    const data = await (await db())
        .collection('posts')
        .find({})
        // Sort by date descending
        .sort({ date: -1 })
        .limit(20)
        .toArray();

    return JSON.parse(JSON.stringify(data));
}

export const getBumpedPosts = async (board: string) => {

    /**
     * Get thread starter (OP) posts from a certain board and sort either by
     * date or the date of the last reply to the post
     */
    const data = await (await db()).collection('posts').aggregate([
        {
            $lookup: {
                from: "posts",
                localField: "replyTo",
                foreignField: "postNum",
                as: "parentPosts"
            }
        },
        {
            $addFields: {
                sortBy: {
                    $cond: {
                        if: { $eq: ["$OP", true] }, // Check if the post is OP
                        then: "$date", // If OP, sort by the post date
                        else: {
                            $cond: {
                                if: {
                                    $gt: [
                                        { $size: "$parentPosts" }, // Check if the parentPosts array exists
                                        0 // Check if it's not empty
                                    ]
                                },
                                then: { $max: "$parentPosts.date" }, // If it exists and not empty, sort by the max date in parentPosts
                                else: "$date" // Otherwise, sort by the post date
                            }
                        }
                    }
                }
            }
        },
        {
            $sort: {
                "sortBy": -1 // Sort by the calculated sort date
            }
        },
        {
            $match: {
                $or: [
                    { OP: true }, // Filter OP posts
                    //{ OP: false, "parentPosts.OP": true } // Filter non-OP posts with a reply to an OP post
                ]
            }
        }
    ]).toArray();

    return JSON.parse(JSON.stringify(data));
}

export const getPost = async (board: string, pn: string) => {
    const postNum = parseInt(pn);
    const post = await (await db()).collection('posts').findOne({ board, postNum });

    // Get replies that have the posts' postNum in their replyTo arrays
    const replies = await (await db()).collection('posts').find({ replyTo: { $in: [postNum] } }).toArray();

    return JSON.parse(JSON.stringify({ ...post, replies }));
}

export const POST = async (req: NextRequest, res: NextResponse) => {
    let success = false;

    try {
        const formData = await req.formData();

        /**
         * FormData can not have arrays as is, the array of replied-to post 
         * numbers was stringified first on the client-side
         */
        const replyTo = JSON.parse(formData.get('replyTo') as string);

        const newPost: NewPostType = {
            content: formData.get('content') as string,
            title: formData.get('title') as string,
            replyTo,
            /**
             * OPs haven't replied to any other posts and they are programmatically not able to
             * do so directly.
             * This may or may not encourage users to post about a new topic in each OP and not
             * discuss the same topic over a chain of OPs
             */
            OP: replyTo.length > 0 ? false : true,
            board: formData.get('board') as string,
            date: new Date()

        }

        const image = formData.get('image') as File;
        if (image.size > 0) newPost.image = image;
        if (!newPost.title) newPost.title = newPost.content.substring(0, 21) + '...';

        const { error, value } = newPostSchema.validate(newPost);
        if (error) throw { message: error.message, status: 400 };

        const filename = image.size > 0 && `${image.name.replaceAll(' ', '_')}`;

        // If user submitted a file...
        if (image.size > 0) {
            /**
             * Create filename from customer name, replacing spaces with underscores,
             * add period, add file extension. If no file was uploaded, filename refers
             * to a fallback/generic profile image in the storage.
             */

            // create a byte array from it
            const buffer = Buffer.from(await image.arrayBuffer());

            // and upload the image file to Amazon S3 storage
            const params = {
                Bucket: AWS_NAME,
                // Key needs to be dir/subdir/filename
                Key: `img/posts/${filename}`,
                Body: buffer,
            };

            const upload = new Upload({
                client: s3,
                params
            });

            upload.on('httpUploadProgress', (_progress) => {
                //
            });

            await upload.done();
        }

        newPost.imageUrl = image.size > 0 ? `${AWS_URL}/img/posts/${filename}` : ''

        delete newPost.image;
        const result = await (await db()).collection('posts').insertOne(newPost);

        if (result.acknowledged && result.insertedId !== null) {
            return NextResponse.json('ok', { status: 200 });
        }
    } catch (e) {
        return NextResponse.json(
            { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : '' },
            { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
        );
    }
    //success && revalidatePath('');
}