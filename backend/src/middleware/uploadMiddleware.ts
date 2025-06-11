import multer from 'multer';
import fs from 'fs';

import { UPLOAD_DIR_PATH } from '../config/config';

if (!fs.existsSync(UPLOAD_DIR_PATH)) {
  fs.mkdirSync(UPLOAD_DIR_PATH, { recursive: true });
}

export const upload = multer({ dest: UPLOAD_DIR_PATH });
