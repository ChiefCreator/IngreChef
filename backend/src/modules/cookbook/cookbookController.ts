import { NextFunction, Request, Response } from 'express';

import type { RecipeFilters } from '../recipe/recipeTypes';

import CookbookService from './cookbookService';
import { BadRequestError } from '../../../errors/BadRequestError';

const cookbookService = new CookbookService();

export default class CookbookController {
  constructor() {}

  async getCookbooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;

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

      const {
        userId,
        page,
        limit,
        titleStartsWith,
        category,
        difficulty,
        cuisine,
        cookingTime,
        ingredients,
        isFavorite,
      } = req.query;

      if (!cookbookId || !userId) {
        throw new BadRequestError("Отсутствуют обязательные поля: cookbookId, userId");
      }
      
      const filters: RecipeFilters = {
        userId: userId as string,
        page: Number(page),
        limit: Number(limit),
        titleStartsWith: titleStartsWith as string | undefined,
        category: category as string | undefined,
        difficulty: difficulty as string | undefined,
        cuisine: cuisine as string | undefined,
        cookingTime: cookingTime ? JSON.parse(cookingTime as string) as RecipeFilters["cookingTime"] : undefined,
        ingredients: ingredients ? ingredients as string[] : undefined,
        isFavorite: isFavorite === "true",
      };

      const cookbook = await cookbookService.getCookbook(cookbookId, filters);
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
}