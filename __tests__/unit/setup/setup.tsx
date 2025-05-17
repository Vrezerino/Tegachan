import { beforeAll, beforeEach, vi } from 'vitest';
import { getClient } from '@/app/lib/db';
import { posts } from '@/__tests__/unit/setup/placeholderData';

const client = await getClient();

beforeAll(async () => {
  try {
    for (const post of posts) {
      await client.query(`
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
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12
        )
      `,
        [
          post.thread,
          post.title,
          post.content,
          post.image_url,
          post.created_at,
          post.ip,
          post.is_op,
          post.board,
          post.admin,
          post.name,
          post.country_name,
          post.country_code
        ]
      );
    }
    console.log('Database initialized!')
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