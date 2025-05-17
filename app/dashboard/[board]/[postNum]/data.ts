import { getClient } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { isErrorWithStatusCodeType } from '@/app/lib/utils';

export const getPost = async (board: string, postNum: string) => {
  const client = await getClient();

  try {
    /**
     * Result set will have a post, all of its replies, and an array of post numbers
     * from posts that the post replied to
     */
    const res = await client.query(`
    WITH RECURSIVE thread_tree AS (
      SELECT
        p.post_num,
        p.thread,
        p.title,
        p.name,
        p.content,
        p.image_url,
        p.created_at,
        p.is_op,
        p.board,
        p.admin,
        p.country_name,
        p.country_code,
        NULL::BIGINT AS parent_post_num
      FROM posts p
      WHERE p.board = '${board}'
        AND p.post_num = ${postNum}

      UNION ALL

      SELECT
        child.post_num,
        child.thread,
        child.title,
        child.name,
        child.content,
        child.image_url,
        child.created_at,
        child.is_op,
        child.board,
        child.admin,
        child.country_name,
        child.country_code,
        r.parent_post_num
      FROM replies r
      INNER JOIN posts child ON child.post_num = r.post_num
      INNER JOIN thread_tree parent ON r.parent_post_num = parent.post_num
    )

    SELECT
      post_num,
      thread,
      title,
      name,
      content,
      image_url,
      created_at,
      is_op,
      board,
      admin,
      country_name,
      country_code,
    ARRAY_AGG(parent_post_num) FILTER (WHERE parent_post_num IS NOT NULL) AS parent_post_nums
    FROM thread_tree
    GROUP BY
      post_num,
      thread,
      title,
      name,
      content,
      image_url,
      created_at,
      is_op,
      board,
      admin,
      country_name,
      country_code
    ORDER BY created_at ASC;`
    );

    return JSON.parse(JSON.stringify(res.rows));
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : 'Error!' },
      { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
    );
  }
};