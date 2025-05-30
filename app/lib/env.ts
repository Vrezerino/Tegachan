// Nullcheck env vars
if (!process.env.PGDB_URL || !process.env.PGDB_URL_DEV) {
  throw new Error('One or more PostgreSQL DB URL environment variables are missing!');
};

if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_BUCKET_NAME_DEV || !process.env.AWS_BUCKET_NAME_TEST) {
  throw new Error('One or more Amazon S3 bucket name environment variables are missing!')
};

if (!process.env.AWS_BUCKET_URL || !process.env.AWS_BUCKET_URL_DEV || !process.env.AWS_BUCKET_URL_TEST) {
  throw new Error('One or more Amazon S3 bucket URLs are missing!')
};

if (!process.env.RSS_FEED_URL) throw new Error('RSS feed URL is missing!');

// Assign database and storage vars conditionally
let PGDB_URL: string;
let AWS_NAME: string;
let AWS_URL: string;

const env = process.env.CI ? 'test' : process.env.NODE_ENV;

switch (env) {
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
const proxylist = process.env.PROXYLIST;
const bwl = process.env.BWL;
const adminPass = process.env.ADMIN;
const RSS_FEED_URL = process.env.RSS_FEED_URL;
//const WSPORT = process.env.WSPORT;

export {
  PGDB_URL,
  AWS_NAME,
  AWS_URL,
  banlist,
  proxylist,
  bwl,
  adminPass,
  RSS_FEED_URL,
  //WSPORT
};