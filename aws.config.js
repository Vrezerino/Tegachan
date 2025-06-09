import { config } from 'aws-sdk';
import { S3 } from '@aws-sdk/client-s3';

config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new S3({
  // The key s3ForcePathStyle is renamed to forcePathStyle.
  forcePathStyle: true,
});
export default s3;