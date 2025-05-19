import { NextFunction, Request, Response } from 'express';

import Service from './favoriteService';
import BadRequestError from '../../../errors/BadRequestError';

const service = new Service();

export default class RecipeController {
  constructor() {}

  async addFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, recipeId } = req.body;

      if (!userId || !recipeId) {
        throw new BadRequestError("Отсутствуют обязательные поля: recipeId, userId");
      }

      const favorite = await service.addFavorite(userId, recipeId);
      res.status(200).json(favorite);
    } catch(error) {
      next(error);
    }
  }
  async deleteFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, recipeId } = req.query;

      if (!userId || !recipeId) {
        throw new BadRequestError("Отсутствуют обязательные поля: recipeId, userId");
      }

      const deletedFavorite = await service.deleteFavorite(userId as string, recipeId as string);
      res.status(200).json(deletedFavorite);
    } catch(error) {
      next(error);
    }
  }
}