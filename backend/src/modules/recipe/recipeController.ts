import { Request, Response, NextFunction } from 'express';
import { mapQueryToFilters, mapQueryToPaginationOptions } from '../../utils/filterUtils';

import RecipeService from './recipeService';

const recipeService = new RecipeService();

import BadRequestError from '../../../errors/BadRequestError';

export default class RecipeController {
  constructor() {}

  async getAllRecipes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        throw new BadRequestError("Поле userId обязательно", { field: "userId" });
      }  

      const pagination = mapQueryToPaginationOptions(req.query);
      const filters = mapQueryToFilters(req.query);

      const result = await recipeService.getAllRecipes(userId, pagination, filters);

      res.status(200).json(result);
    } catch(error) {
      next(error);
    }
  }
  async getUserRecipes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId as string;

      if (!userId) {
        throw new BadRequestError("Поле userId обязательно", { field: "userId" });
      }  

      const pagination = mapQueryToPaginationOptions(req.query);
      const filters = mapQueryToFilters(req.query);

      const result = await recipeService.getUserRecipes(userId, pagination, filters);
    
      res.status(200).json(result); 
    } catch(error) {
      next(error);
    }
  }
  async getRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { recipeId } = req.params;
      const userId = req.query.userId as string;

      if (!recipeId || !userId) {
        throw new BadRequestError("Отсутствуют обязательные поля: recipeId, userId", { misssingFields: ["userId", "recipeId"] });
      }

      const recipe = await recipeService.getRecipe(userId, recipeId);
      
      res.status(200).json(recipe);
    } catch(error) {
      next(error);
    }
  }

  async selectGeneratedRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, recipeId } = req.body;

      if (!recipeId || !userId) {
        throw new BadRequestError("Отсутствуют обязательные поля: recipeId");
      }

      const recipe = await recipeService.selectGeneratedRecipe(userId, recipeId);
      
      res.status(200).json(recipe);
    } catch(error) {
      next(error);
    }
  }
}