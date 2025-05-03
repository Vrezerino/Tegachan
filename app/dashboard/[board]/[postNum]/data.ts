import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { PGDB_URL } from '@/app/lib/env';
import { isErrorWithStatusCodeType } from '../../../lib/utils';

export const getPost = async (board: string, postNum: string) => {
  const sql = neon(PGDB_URL);

  try {
    /**
     * Result set will have a post, all of its replies, and an array of post numbers
     * from posts that the post replied to
     */
    const res = await sql`
    WITH RECURSIVE thread_tree AS (
      SELECT
        p.post_num,
        p.thread,
        p.title,
        p.content,
        p.image_url,
        p.created_at,
        p.is_op,
        p.board,
        p.admin,
        NULL::BIGINT AS parent_post_num
      FROM posts p
      WHERE p.board = ${board}
        AND p.post_num = ${postNum}

      UNION ALL

      SELECT
        child.post_num,
        child.thread,
        child.title,
        child.content,
        child.image_url,
        child.created_at,
        child.is_op,
        child.board,
        child.admin,
        r.parent_post_num
      FROM replies r
      INNER JOIN posts child ON child.post_num = r.post_num
      INNER JOIN thread_tree parent ON r.parent_post_num = parent.post_num
    )

    SELECT
      post_num,
      thread,
      title,
      content,
      image_url,
      created_at,
      is_op,
      board,
      admin,
    ARRAY_AGG(parent_post_num) FILTER (WHERE parent_post_num IS NOT NULL) AS parent_post_nums
    FROM thread_tree
    GROUP BY
      post_num,
      thread,
      title,
      content,
      image_url,
      created_at,
      is_op,
      board,
      admin
    ORDER BY created_at ASC;`
  ;

    return JSON.parse(JSON.stringify(res));
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : 'Error!' },
      { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
    );
  }
};