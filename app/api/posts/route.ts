import { getMongoDb as db } from '@/app/lib/mongodb';
import { newPostSchema } from '@/app/lib/newPostSchema';
import { NewPostType } from '@/app/lib/definitions';
import {
    ACCEPTED_IMAGE_TYPES,
    MAX_FILE_SIZE, boards,
    sanitizeString,
    isErrorWithStatusCodeType,
    findExactInString
} from '@/app/lib/utils';

import s3 from '@/aws.config';
import { Upload } from '@aws-sdk/lib-storage';
import { AWS_NAME, AWS_URL } from '../../lib/env';
import { NextRequest, NextResponse } from 'next/server';
const banlist = process.env.BANLIST;

export const POST = async (req: NextRequest) => {

    // This function is called after an insertion of a new post
    const fetchPostWithPostNum = async (postId: any, retries = 5, delay = 100) => {
        for (let i = 0; i < retries; i++) {
            const insertedPost = await (await db())
                .collection('posts')
                .findOne({ _id: postId }, { projection: { postNum: 1 } });

            if (insertedPost && insertedPost.postNum !== undefined) {
                return insertedPost.postNum;
            }

            // Wait before the next attempt
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        console.error('PostNum not found after multiple attempts.');
    }

    // Make new post and insert into database
    try {
        const ip = req.headers.get('x-real-ip');
        if (ip && banlist && findExactInString(ip, banlist)) {
            throw { message: 'Can not post at this time.', status: 403 };
        }

        const formData = await req.formData();
        const file = formData.get('image') as File;

        if (file?.size > 0) {
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                throw { message: 'File is not of accepted type! JPG/PNG/WEBP only.', status: 400 };
            }

            if (file?.size >= MAX_FILE_SIZE) {
                throw { message: 'Image must be under 1MB in size.', status: 400 };
            }
        }

        const sanitizedBoardName = sanitizeString(formData.get('board') as string);
        const regex = new RegExp('\\b' + sanitizedBoardName + '\\b');
        if (!regex.test(boards)) throw { message: 'Unknown board', status: 400 };

        const content = sanitizeString(formData.get('content') as string);
        const OP = (formData.get('OP') as unknown) === 'true';
        const threadNum = formData.get('thread') as string;

        const newPost: NewPostType = {
            content,
            // Generate title from truncated post content, only if you're OP
            title: OP ? content.length > 25
                ? content.substring(0, 21) + '...'
                : content : '',
            OP,
            thread: parseInt(threadNum),
            board: sanitizedBoardName,
            replies: [],
            date: new Date(),
            IP: req.headers.get('x-real-ip') || 'none'
        }

        if (file?.size > 0) newPost.image = file;

        const { error } = newPostSchema.validate(newPost);
        if (error) throw { message: error.message, status: 400 };

        // Replace possible spaces in filename with underscores
        const filename = (file?.size > 0) && `${file.name.replaceAll(' ', '_')}`;

        // If user submitted a file...
        if (file?.size > 0) {

            // create a byte array from it
            const buffer = Buffer.from(await file.arrayBuffer());

            // and upload the image file to Amazon S3 storage
            const params = {
                Bucket: AWS_NAME,
                // Key needs to be dir/subdir/filename
                Key: `img/posts/${filename}`,
                Body: buffer,
                ContentType: file.type,
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

        // Set post's imageUrl as the url of the image we just uploaded, and delete file
        newPost.imageUrl = file?.size > 0 ? `${AWS_URL}/img/posts/${filename}` : '';
        delete newPost.image;

        // Save post to database
        const result = await (await db()).collection('posts').insertOne(newPost);

        // Get the postNum of the post we just inserted
        const newPostNum = await fetchPostWithPostNum(result.insertedId);

        // Add the postNum to all recipient's reply array
        const recipients: number[] = JSON.parse(formData.get('replyTo') as string);

        if (recipients?.length > 0) {
            await (await db()).collection('posts').updateMany(
                { 'postNum': { $in: recipients } },
                {
                    $push: { replies: newPostNum }
                }
            );
        }

        if (result.acknowledged && result.insertedId) {
            return NextResponse.json('Created', { status: 201 });
        }
    } catch (e) {
        return NextResponse.json(
            { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : 'Error!' },
            { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
        );
    }
}