import { Router } from 'express';

import { upload } from '../../middleware/uploadMiddleware';
import UploadController from './uploadController';

const router = Router();
const uploadController = new UploadController();

router.post("/", upload.single("image"), uploadController.uploadFile);
router.get("/", uploadController.getUploads);

export default router;
