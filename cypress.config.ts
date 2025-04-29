import { defineConfig } from 'cypress';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();
const PGDB_URL = process.env.PGDB_URL_DEV;
if (!PGDB_URL) {
  throw new Error('Error on Cypress clean-up: PGDB_URL not defined');
}
const sql = neon(PGDB_URL);

export default defineConfig({
  e2e: {
    specPattern: '__tests__/e2e/**/*.cy.ts',
    setupNodeEvents(on, _config) {
      on('task', {
        cypressCleanup() {
          return sql`
            DELETE FROM posts
            WHERE content LIKE 'Cypress posted this%'`
            .then(() => {
              console.log('Database cleared!');
              return null;
            })
            .catch((err: any) => {
              console.error(err);
              throw err;
            });
        }
      });
    }
  },
});
