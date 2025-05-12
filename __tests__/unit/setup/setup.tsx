import { beforeAll, beforeEach, vi } from 'vitest';
import { neon } from '@neondatabase/serverless';
import { PGDB_URL } from '@/app/lib/env';
import { posts } from '@/__tests__/unit/setup/placeholderData';

const sql = neon(PGDB_URL);

beforeAll(async () => {
  try {
    for (const post of posts) {
      await sql`
        INSERT INTO posts (
          thread,
          title,
          content,
          image_url,
          created_at,
          ip,
          is_op,
          board,
          admin,
          name,
          country_name,
          country_code
        )
        VALUES (
          ${post.thread},
          ${post.title},
          ${post.content},
          ${post.image_url},
          ${post.created_at},
          ${post.ip},
          ${post.is_op},
          ${post.board},
          ${post.admin},
          ${post.name},
          ${post.country_name},
          ${post.country_code}
        )
      `;
    }
    console.log('Database initialized!')
    //const rows = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
    //console.log(rows);
  } catch (e) {
    console.error(e);
  }
});

// To avoid "TypeError: {fontname} is not a function":
beforeEach(() => {
  vi.mock('next/font/google', async (importOriginal) => {
    const mod = await importOriginal<typeof import('next/font/google')>()
    return {
      ...mod,
      // replace exports
      Inter: () => ({
        style: {
          fontFamily: 'mocked',
        },
      }),
      Lusitana: () => ({
        style: {
          fontFamily: 'mocked',
        },
      }),
    }
  });
});