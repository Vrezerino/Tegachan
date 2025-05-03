import { neon } from '@neondatabase/serverless';
import { PGDB_URL } from '@/app//lib/env';

import { newPostSchema } from '@/app/lib/newPostSchema';
import { NewPostType } from '@/app/lib/definitions';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  isErrorWithStatusCodeType,
  findExactInString,
  links,
  sanitizeString,
  removeGapsFromString,
  recipientsJSONparser,
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
      throw { message: `Try again in ${retryAfterSeconds} seconds.`, status: 429 };
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (file?.size > 0) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        throw { message: 'GIF/JPG/PNG/WEBP/AVIF only.', status: 400 };
      }

      if (file?.size >= MAX_FILE_SIZE) {
        throw { message: 'Image must be under 1MB in size.', status: 400 };
      }
    }

    // Sanitize form data entries
    const sanitizedBoardName = sanitizeString(formData.get('board'));
    const boardSearchResult = links.find((l) => l.href.split('/')[2] === sanitizedBoardName);
    if (!boardSearchResult) throw { message: 'Unknown board', status: 400 };

    const content = removeGapsFromString(formData.get('content'));

    const is_op_raw = sanitizeString((formData.get('OP')));
    const is_op = is_op_raw === 'true';

    // Null at the time of creating thread/you're op, so null is allowed here
    const threadNum = formData.get('thread') ? sanitizeString(formData.get('thread')) : null;

    // Parse and check stringified recipients array
    const recipientsRaw: unknown = formData.get('recipients');
    const recipients = recipientsJSONparser(recipientsRaw);

    const newPost: NewPostType = {
      content,
      // Generate title from truncated post content, only if you're OP
      title: is_op ? content.length > 25
        ? content.substring(0, 21) + '...'
        : content : '',
      is_op,
      thread: threadNum ? parseInt(threadNum) : 0,
      board: sanitizedBoardName,
      recipients,
      created_at: new Date(),
      ip: ip || 'none',
      admin: false // fuck with later
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
    newPost.image_url = file?.size > 0 ? `${AWS_URL}/img/posts/${filename}` : '';
    delete newPost.image;

    // Insert post into db
    const { thread, title, image_url, created_at, board, admin } = newPost;
    const sql = neon(PGDB_URL);
    const res = await sql`
      INSERT INTO posts (
        thread,
        title,
        content,
        image_url,
        created_at,
        ip,
        is_op,
        board,
        admin
      ) VALUES (
        ${thread},
        ${title},
        ${content},
        ${image_url},
        ${created_at},
        ${ip},
        ${is_op},
        ${board},
        ${admin}
      )
      RETURNING post_num`
      ;

    const newPostNum = res[0].post_num;

    // Insert replies (if any)
    if (recipients.length > 0) {
      for (const parentPostNum of recipients) {
        await sql`
          INSERT INTO replies (post_num, parent_post_num)
          VALUES (${newPostNum}, ${parentPostNum})`
          ;
      }
    }

    return NextResponse.json('Created', { status: 201 });

  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : 'Error!' },
      { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
    );
  }
}