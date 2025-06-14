import { NextFunction, Request, Response } from 'express';

import CookbookService from './cookbookService';
import BadRequestError from '../../../errors/BadRequestError';

import { mapQueryToFilters, mapQueryToPaginationOptions } from '../../utils/filterUtils';

const cookbookService = new CookbookService();

export default class CookbookController {
  constructor() {}

  async getCookbooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        throw new BadRequestError("Поле userId обязательно"); 
      } 

      const cookbooks = await cookbookService.getCookbooks(userId);
      res.status(200).json(cookbooks);
    } catch(error) {
      next(error);
    }
  }
  async getCookbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cookbookId = req.params.cookbookId;
      const userId = req.query.userId as string;

      if (!cookbookId || !userId) {
        throw new BadRequestError("Отсутствуют обязательные поля: cookbookId, userId");
      }

      const pagination = mapQueryToPaginationOptions(req.query);
      const filters = mapQueryToFilters(req.query);

      const cookbook = await cookbookService.getCookbook(userId, cookbookId, pagination, filters);
      res.status(200).json(cookbook);
    } catch(error) {
      next(error);
    }
  }

  async createCookbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, cookbookId, name, colorPalette } = req.body;

      if (!name || !cookbookId || !userId || !colorPalette) {
        throw new BadRequestError("Поле userId, cookbookId, name, colorPalette обязательны"); 
      }

      const cookbook = await cookbookService.createCookbook(userId, cookbookId, name, colorPalette);
      res.status(200).json(cookbook);
    } catch(error) {
      next(error);
    }
  }

  async addRecipeToCookbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cookbookId = req.params.cookbookId;
      const { userId, recipeId } = req.body;

      if (!userId || !cookbookId || !recipeId) {
        throw new BadRequestError("Отсутствуют обязательные поля: userId, cookbookId, recipeId");
      }
      
      const addededRecipe = await cookbookService.addRecipeToCookbook(userId, cookbookId, recipeId);
      res.status(200).json(addededRecipe);
    } catch(error) {
      next(error);
    }
  }
  async removeRecipeFromCookbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cookbookId = req.params.cookbookId;
      const { userId, recipeId } = req.body;

      if (!userId || !cookbookId || !recipeId) {
        throw new BadRequestError("Отсутствуют обязательные поля: userId, cookbookId, recipeId");
      }

      const deletedRecipe = await cookbookService.removeRecipeFromCookbook(userId, cookbookId, recipeId);
      res.status(200).json(deletedRecipe);
    } catch(error) {
      next(error);
    }
  }
}