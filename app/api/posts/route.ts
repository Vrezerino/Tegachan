import { getClient } from '@/app/lib/db';
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
  findInStringList,
  getClientIp,
  evaluateName
} from '@/app/lib/utils';

import { v4 as uuidv4 } from 'uuid';
import s3 from '@/aws.config';
import { Upload } from '@aws-sdk/lib-storage';
import { AWS_NAME, AWS_URL, banlist, proxylist, bwl, adminPass } from '../../lib/env';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/app/lib/rateLimit';
import { QueryResult } from 'pg';

export const POST = async (req: NextRequest) => {
  const client = await getClient();
  try {
    const ip = getClientIp(req);

    // Check if ip in banlist or proxylist
    if (findExactInString(ip, banlist)) throw { message: 'Can not post at this time.', status: 403 };
    if (findExactInString(ip, proxylist)) throw { message: 'Posting from proxy not allowed.', status: 403 };

    // Limit rate based on ip
    const { limited, retryAfterSeconds } = await checkRateLimit(ip as string);
    if (limited) throw { message: `Try again in ${retryAfterSeconds} seconds.`, status: 429 };

    const geo_res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'Wget/1.21.1',
        'Accept': 'application/json',
        'Accept-Encoding': 'identity',
        'Connection': 'Keep-Alive',
      }
    });
    const geo = await geo_res.json();

    const country_name = geo.country_name || 'Unknown';
    const country_code = geo.country_code || 'XX';

    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (file?.size > 0) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) throw { message: 'GIF/JPG/PNG/WEBP/AVIF only.', status: 400 };
      if (file?.size >= MAX_FILE_SIZE) throw { message: `Image must be under ${MAX_FILE_SIZE / 1000000} in size.`, status: 400 };
    }

    const content = removeGapsFromString(formData.get('content'));
    if (findInStringList(content, false, bwl)) throw { message: 'Watch your language.', status: 403 };

    // Sanitize form data entries
    const sanitizedBoardName = sanitizeString(formData.get('board'));
    const boardSearchResult = links.find((l) => l.href.split('/')[1] === sanitizedBoardName);
    if (!boardSearchResult) throw { message: 'Unknown board', status: 400 };

    const rawTitle = formData.get('title');
    const title = rawTitle ? removeGapsFromString(rawTitle) : null;

    const is_op_raw = sanitizeString((formData.get('OP')));
    const is_op = is_op_raw === 'true';

    // Null at the time of creating thread/you're op, so null is allowed here
    const threadNum = formData.get('thread') ? sanitizeString(formData.get('thread')) : null;

    // Parse and check stringified recipients array
    const recipientsRaw: unknown = formData.get('recipients');
    const recipients = recipientsJSONparser(recipientsRaw);

    // Evaluate poster's name and check if they're admin
    const rawName = formData.get('name');
    const { name, admin } = evaluateName(rawName, adminPass);

    const newPost: NewPostType = {
      content,
      name,
      title,
      is_op,
      thread: threadNum ? parseInt(threadNum) : 0,
      board: sanitizedBoardName,
      recipients,
      created_at: new Date(),
      ip: ip || 'none',
      admin,
      country_name,
      country_code,
    }

    if (file?.size > 0) {
      newPost.image = file;
      newPost.image_size_bytes = file.size;
    }

    const { error } = newPostSchema.validate(newPost);
    if (error) throw { message: error.message, status: 400 };

    // Generate filename
    const filename = (file?.size > 0) && `${uuidv4()}.${file.type.split('/')[1]}`;

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
    const { thread, image_url, created_at, board, image_size_bytes } = newPost;

    // Insert post into db
    const res: QueryResult<{ post_num: number }> = await client.query(`
      INSERT INTO posts (
        thread,
        name,
        title,
        content,
        image_url,
        created_at,
        ip,
        is_op,
        board,
        admin,
        country_name,
        country_code,
        image_size_bytes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      RETURNING post_num
    `, [
      thread,
      name,
      title,
      content,
      image_url,
      created_at,
      ip,
      is_op,
      board,
      admin,
      country_name,
      country_code,
      image_size_bytes
    ]);

    const newPostNum = res.rows[0].post_num;

    // Insert replies if post has replied to others
    if (recipients.length > 0) {
      for (const parentPostNum of recipients) {
        await client.query(`
          INSERT INTO replies (post_num, parent_post_num)
          VALUES (${newPostNum}, ${parentPostNum})`);
      }
    }

    return NextResponse.json({ message: 'Created', post_num: newPostNum }, { status: 201 });
  } catch (e) {
    console.error('Error on POST:', (e instanceof Error || isErrorWithStatusCodeType(e)) ? e.message : e);
    return NextResponse.json(
      { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : e },
      { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
    );
  }
}