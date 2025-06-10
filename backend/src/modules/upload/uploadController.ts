import { NextFunction, Request, Response } from 'express';

import UploadService from './uploadService';

import type { UploadedFile } from './uploadTypes';
import AppError from '../../../errors/AppError';

const uploadService = new UploadService();

export default class UploadController {
  constructor() {}

  uploadFile = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError({ message: "Файл не был загружен" });
      }
    
      res.json({
        message: "Файл успешно загружен",
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
      });
    } catch(error) {
      next(error);
    }
  };

  async getUploads(req: Request, res: Response, next: NextFunction) {
    try {
      const files: UploadedFile[] = uploadService.getUploads();
      res.json(files);
    } catch (error) {
      next(error);
    }
  }
}