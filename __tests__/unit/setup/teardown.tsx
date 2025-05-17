import { afterAll } from 'vitest';
import { getClient } from '@/app/lib/db';

const client = await getClient();

afterAll(async () => {
  await new Promise(res => setTimeout(res, 2000));
  try {
    await client.query(`
    DELETE FROM POSTS
      WHERE ip = '10.0.42.17'`);
    console.log('Database cleared!')
  } catch (e) {
    console.error(e);
  }
});