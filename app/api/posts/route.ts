import { getMongoDb as db } from '@/app/lib/mongodb';
import { newPostSchema } from '@/app/lib/newPostSchema';
import { NewPostType } from '@/app/lib/definitions';
import {
    ACCEPTED_IMAGE_TYPES,
    MAX_FILE_SIZE, boards,
    sanitizeString,
    isErrorWithStatusCodeType
} from '@/app/lib/utils';

import s3 from '@/aws.config';
import { Upload } from '@aws-sdk/lib-storage';
import { AWS_NAME, AWS_URL } from '../../lib/env';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const ip = req.headers.get('x-real-ip');
        if (ip && process.env.BANLIST?.split('').includes(ip)) {
            throw { message: 'Can not post at this time.', status: 403 };
        }

        const formData = await req.formData();
        const file = formData.get('image') as File;

        if (file && file.size > 0) {
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                throw { message: 'File is not of accepted type! JPG/PNG/WEBP only.', status: 400 };
            }

            if (file && file.size >= MAX_FILE_SIZE) {
                throw { message: 'Image must be under 1MB in size.', status: 400 };
            }
        }

        const sanitizedBoardName = sanitizeString(formData.get('board') as string);
        const regex = new RegExp('\\b' + sanitizedBoardName + '\\b');
        if (!regex.test(boards)) throw { message: 'Unknown board', status: 400 };

        /**
         * FormData can not have arrays as is; the array of replied-to post 
         * numbers was stringified first on the client-side
         */
        const replyTo = JSON.parse(formData.get('replyTo') as string);

        const newPost: NewPostType = {
            // Content will be stripped of multiple linebreaks and spaces
            content: sanitizeString(formData.get('content') as string),
            title: sanitizeString(formData.get('title') as string),
            replyTo,
            /**
             * OPs haven't replied to any other posts and they are programmatically not able to
             * do so directly.
             */
            OP: replyTo?.length > 0 ? false : true,
            board: sanitizedBoardName,
            date: new Date(),
            IP: req.headers.get('x-real-ip') || 'none'
        }


        if (file && file.size > 0) newPost.image = file;

        if (!newPost.title) {
            newPost.title = newPost.content.length > 25
                ? newPost.content.substring(0, 21) + '...'
                : newPost.content;
        }

        const { error } = newPostSchema.validate(newPost);
        if (error) throw { message: error.message, status: 400 };

        // Replace possible spaces in filename with underscores
        const filename = (file && file.size > 0) && `${file.name.replaceAll(' ', '_')}`;

        // If user submitted a file...
        if (file && file.size > 0) {

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
        newPost.imageUrl = file && file.size > 0 ? `${AWS_URL}/img/posts/${filename}` : '';
        delete newPost.image;

        // Finally, save post to database
        const result = await (await db()).collection('posts').insertOne(newPost);

        if (result.acknowledged && result.insertedId !== null) {
            return NextResponse.json('Created', { status: 201 });
        }
    } catch (e) {
        return NextResponse.json(
            { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : 'Error!' },
            { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
        );
    }
}