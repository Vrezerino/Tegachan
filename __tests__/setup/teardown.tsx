import { neon } from '@neondatabase/serverless';
import { PGDB_URL } from '../../app/lib/env';

const sql = neon(PGDB_URL);

afterAll(async () => {
  await new Promise(res => setTimeout(res, 2000));
  try {
    await sql`
    DELETE FROM POSTS
    WHERE ip = '999.999.999.999'`;
    console.log('Database cleared!')
  } catch (e) {
    console.error(e);
  }
});