import { vi } from 'vitest';

import { getMongoDb as db } from '@/app/lib/mongodb';
import { posts } from '@/app/lib/placeholderData';

export const initDb = async () => {
  try {
    await (await db())?.collection('posts').insertMany(posts);
    console.log('Database initialized!')
  } catch (e) {
    console.error(e);
  }
};

export const clearDb = async () => {
  try {
    await (await db())?.collection('posts').deleteMany({});
    console.log('Database cleared!')
  } catch (e) {
    console.error(e);
  }
};

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