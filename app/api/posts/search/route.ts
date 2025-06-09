import { getClient } from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { isErrorWithStatusCodeType } from '@/app/lib/utils';

export const GET = async (req: NextRequest) => {
  const client = await getClient();
  const query = req.nextUrl.searchParams.get('q');

  if (!query || query.trim() === '') return NextResponse.json([], { status: 200 });

  try {
    const res = await client.query(`
      SELECT
        title,
        name,
        content,
        post_num,
        created_at,
        thread,
        board,
        is_op,
        country_code
      FROM posts
      WHERE content ILIKE '${'%' + query + '%'}'
        OR name ILIKE '${'%' + query + '%'}'
        OR title ILIKE '${'%' + query + '%'}'
      ORDER BY created_at DESC
      LIMIT 20;
    `);

    return NextResponse.json(res.rows, { status: 200 });
  } catch (e) {
    console.error('Error on GET:', (e instanceof Error || isErrorWithStatusCodeType(e)) ? e.message : e);
    return NextResponse.json(
      { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : e },
      { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
    );
  }
};