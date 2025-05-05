import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { PGDB_URL } from '@/app/lib/env';
import { isErrorWithStatusCodeType } from '@/app/lib/utils';

export const getBumpedPosts = async (board: string) => {

  /**
   * Get thread starter (OP) posts from a certain board and sort either by
   * date or the date of the last reply to the post
   */
  const sql = neon(PGDB_URL);
  
  try {
    const res = await sql
      `SELECT
        p.post_num,
        p.thread,
        p.title,
        p.content,
        p.image_url,
        p.created_at AS op_created_at,
        p.is_op,
        p.board,
        p.admin,
        p.name,
      COUNT(r.post_num) AS num_replies,
      MAX(reply_posts.created_at) AS latest_reply_created_at
      FROM posts p
      LEFT JOIN replies r ON p.post_num = r.parent_post_num
      LEFT JOIN posts reply_posts ON r.post_num = reply_posts.post_num -- Join to get created_at for replies
      WHERE p.is_op = true
        AND p.board = ${board}
      GROUP BY p.post_num
      ORDER BY COALESCE(MAX(reply_posts.created_at), p.created_at) DESC;`
    ;

    return JSON.parse(JSON.stringify(res));
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : 'Error!' },
      { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
    );
  }
};