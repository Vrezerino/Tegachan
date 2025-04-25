import { getMongoDb as db } from '@/app/lib/mongodb';
import { newPostSchema } from '@/app/lib/newPostSchema';
import { NewPostType, CounterDocument } from '@/app/lib/definitions';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  sanitizeString,
  isErrorWithStatusCodeType,
  findExactInString,
  links,
  removeGapsFromString,
} from '@/app/lib/utils';

import s3 from '@/aws.config';
import { Upload } from '@aws-sdk/lib-storage';
import { AWS_NAME, AWS_URL, banlist } from '../../lib/env';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/app/lib/rateLimit';

export const POST = async (req: NextRequest) => {
  try {
    const ip = req.headers.get('x-real-ip');

    // Check if ip in banlist
    if (findExactInString(ip, banlist)) {
      throw { message: 'Can not post at this time.', status: 403 };
    }

    // Limit rate based on ip
    const { limited, retryAfterSeconds } = await checkRateLimit(ip as string);

    if (limited) {
      throw { message: `Too many requests. Try again in ${retryAfterSeconds}s`, status: 429 };
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
    const boardSearchResult = links.find((l) => l.href.split('/')[2] === sanitizedBoardName);
    if (!boardSearchResult) throw { message: 'Unknown board', status: 400 };

    // Enforce string type so MongoDB won't read content as object in possible NoSQL attack
    const content = removeGapsFromString(String(formData.get('content')));
    const OP = (formData.get('OP') as unknown) === 'true';
    const threadNum = formData.get('thread') as string;

    const newPost: NewPostType = {
      content,
      // Generate title from truncated post content, only if you're OP
      title: OP ? content.length > 25
        ? content.substring(0, 21) + '...'
        : content : '',
      OP,
      thread: parseInt(threadNum) || 0,
      board: sanitizedBoardName,
      replies: [],
      date: new Date(),
      IP: ip || 'none'
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

    // Set post's imageUrl as url of the image we just uploaded to Amazon S3
    newPost.imageUrl = file?.size > 0 ? `${AWS_URL}/img/posts/${filename}` : '';
    delete newPost.image;

    // Increment counter value atomically
    const getNextPostNum = async (): Promise<number> => {
      const result = await (await db()).collection<CounterDocument>('counters').findOneAndUpdate(
        { _id: 'postNum' },
        { $inc: { seq_value: 1 } },
        { returnDocument: 'after', upsert: true }
      );

      if (result) {
        return result.seq_value;
      } else {
        throw { message: 'Failed incrementing postNum counter', status: 500 };
      }
    };

    const newPostNum = await getNextPostNum();

    // Save post to database
    const result = await (await db()).collection('posts').insertOne({
      ...newPost,
      postNum: newPostNum
    });

    // Add the postNum to all recipients' reply arrays
    const recipients = JSON.parse(formData.get('replyTo') as string);

    if (recipients?.length > 0) {
      await (await db()).collection<NewPostType>('posts').updateMany(
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