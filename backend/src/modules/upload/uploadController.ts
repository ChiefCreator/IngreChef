import { NextFunction, Request, Response } from 'express';
require("./../../../env/env");

import UploadService from './uploadService';
import AppError from '../../../errors/AppError';

import type { UploadedFile } from './uploadTypes';

const uploadService = new UploadService();

export default class UploadController {
  constructor() {}

  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError({ message: "Файл не был загружен" });
      }

      const localFilePath = req.file.path;

      const fileUrl = await uploadService.uploadFile(localFilePath, req.file.mimetype);

      fs.unlinkSync(localFilePath);

      res.status(200).json(fileUrl);
    } catch(error) {
      next(error);
    }
  };
}