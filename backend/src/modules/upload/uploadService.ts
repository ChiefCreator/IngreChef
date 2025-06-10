import fs from 'fs';
import { UPLOAD_DIR } from '../../config/config';

export default class UploadService {
  constructor() {};

  getUploads() {
    if (!fs.existsSync(UPLOAD_DIR)) {
      return [];
    }
  
    const files = fs.readdirSync(UPLOAD_DIR);
  
    return files.map(file => ({
      filename: file,
      url: `/uploads/${file}`,
    }));
  };
}
