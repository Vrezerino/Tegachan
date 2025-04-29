/** 
 * This file holds database and storage variables that depend on
 * the existence and values of environment variables in .env
*/

// Nullcheck environment variables
if (!process.env.PGDB_URL || !process.env.PGDB_URL_DEV) {
  throw new Error('One or more PostgreSQL Neon DB URL environment variables are missing!');
};

if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_BUCKET_NAME_DEV || !process.env.AWS_BUCKET_NAME_TEST) {
  throw new Error('One or more Amazon S3 bucket name environment variables are missing!')
};

if (!process.env.AWS_BUCKET_URL || !process.env.AWS_BUCKET_URL_DEV || !process.env.AWS_BUCKET_URL_TEST) {
  throw new Error('One or more Amazon S3 bucket URLs are missing!')
};

let PGDB_URL: string;
let AWS_NAME: string;
let AWS_URL: string;

// Assign database and storage variables conditionally
switch (process.env.NODE_ENV) {
  case 'production':
    PGDB_URL = process.env.PGDB_URL;
    AWS_NAME = process.env.AWS_BUCKET_NAME;
    AWS_URL = process.env.AWS_BUCKET_URL;
    break;
  case 'development':
    PGDB_URL = process.env.PGDB_URL_DEV;
    AWS_NAME = process.env.AWS_BUCKET_NAME_DEV;
    AWS_URL = process.env.AWS_BUCKET_URL_DEV;
    break;
  case 'test':
    PGDB_URL = process.env.PGDB_URL_DEV;
    AWS_NAME = process.env.AWS_BUCKET_NAME_TEST;
    AWS_URL = process.env.AWS_BUCKET_URL_TEST;
    break;
  default:
    throw new Error('Invalid NODE_ENV!');
};

const banlist = process.env.BANLIST;

export { PGDB_URL, AWS_NAME, AWS_URL, banlist };