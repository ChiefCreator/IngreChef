import fs from 'fs';
import path from 'path';
import { s3Client } from '../../services/yandexStorage';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 } from 'uuid';

export default class UploadService {
  constructor() {};

  async uploadFile(localFilePath: string, mimeType: string) {
    try {
      const fileContent = fs.readFileSync(localFilePath);
      const fileName = v4() + path.extname(localFilePath);
      const fileKey = `${process.env.YA_UPLOADS_PATH}/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: process.env.YA_BUCKET_NAME!,
        Key: fileKey,
        Body: fileContent,
        ContentType: mimeType,
        ACL: "public-read",
      });
    
      await s3Client.send(command);

      return `https://${process.env.YA_BUCKET_NAME}.storage.yandexcloud.net/${fileKey}`;
    } catch(error) {
      throw error;
    }
  };
}
