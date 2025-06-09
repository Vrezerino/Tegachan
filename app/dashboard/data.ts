import { getClient } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { isErrorWithStatusCodeType } from '@/app/lib/utils';

export const getLatestPosts = async () => {
  const client = await getClient();

  // Get fifteen latest posts from all boards
  try {
    const res = await client.query(`
      SELECT
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
      DESC LIMIT 15
    `);

    return JSON.parse(JSON.stringify(res.rows));
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : 'Error!' },
      { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
    );
  }
};

export const getStatistics = async () => {
  const client = await getClient();

  try {
    const postCount = await client.query(`SELECT COUNT (post_num) FROM posts`);
    const activeContentSize = await client.query(`
      SELECT SUM(image_size_bytes) / (1024 * 1024) AS total_size_mb FROM posts;
    `);
    const uniqueIps = await client.query(`SELECT COUNT (DISTINCT ip) FROM posts;`)

    return JSON.parse(JSON.stringify({
      postCount: postCount.rows[0].count,
      activeContentSize: activeContentSize.rows[0].total_size_mb,
      uniqueIps: uniqueIps.rows[0].count
    }));
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : 'Error!' },
      { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
    );
  }
};