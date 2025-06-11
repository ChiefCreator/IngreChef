import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.YA_REGION,
  endpoint: process.env.YA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.YA_ACCESS_KEY_ID!,
    secretAccessKey: process.env.YA_SECRET_ACCESS_KEY!,
  },
});
