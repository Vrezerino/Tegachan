import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { PGDB_URL } from '../lib/env';
import { isErrorWithStatusCodeType } from '../lib/utils';

export const getLatestPosts = async () => {
  const sql = neon(PGDB_URL);

  // Get fifteen latest posts from all boards
  try {
    const res = await sql
      `SELECT
        post_num,
        thread,
        title,
        content,
        image_url,
        created_at,
        is_op,
        board
      FROM posts
      ORDER BY created_at
      DESC LIMIT 15`
    ;

    return JSON.parse(JSON.stringify(res));
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : 'Error!' },
      { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
    );
  }
};