import { NextFunction, Request, Response } from 'express';

import UserService from './userService';
import BadRequestError from '../../../errors/BadRequestError';
import { denormalizeEnumFields } from '../../middleware/normalizeEnumFields';

import type { UserProfileData } from './userTypes';

const userService = new UserService();

export default class UserController {
  constructor() {}

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      const includeParamsJSON = req.query["include"] as string; 
      const includeParams = JSON.parse(includeParamsJSON) as string[];

      const includes = Array.isArray(includeParams) ? includeParams : [];

      const allowedIncludes = ["profile"];
      const include: Record<string, boolean> = {};
    
      includes.forEach((key) => {
        if (allowedIncludes.includes(key)) {
          include[key] = true;
        }
      });

      if (!userId) {
        throw new BadRequestError("Отсутствуют обязательные поля: userId");
      }

      const userData = await userService.getUser(userId, include);

      res.status(200).json(userData);
    } catch(error) {
      next(error);
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      const updatedProfileFields = req.body as UserProfileData;

      if (!userId) {
        throw new BadRequestError("Отсутствуют обязательные поля: userId");
      }

      const profile = await userService.updateUserProfile(userId, updatedProfileFields);
      const transformedProfile = denormalizeEnumFields(profile, ["gender", "cookingLevel"]);

      res.status(200).json(transformedProfile);
    } catch(error) {
      next(error);
    }
  }
}