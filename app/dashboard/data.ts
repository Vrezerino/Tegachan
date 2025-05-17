import { getClient } from '../lib/db';
import { NextResponse } from 'next/server';
import { isErrorWithStatusCodeType } from '../lib/utils';

export const getLatestPosts = async () => {
  const client = await getClient();

  // Get fifteen latest posts from all boards
  try {
    const res = await client.query(
      `SELECT
        post_num,
        thread,
        title,
        content,
        image_url,
        created_at,
        is_op,
        board,
        name,
        admin,
        country_name,
        country_code
      FROM posts
      ORDER BY created_at
      DESC LIMIT 15`
    );

    return JSON.parse(JSON.stringify(res.rows));
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : 'Error!' },
      { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
    );
  }
};