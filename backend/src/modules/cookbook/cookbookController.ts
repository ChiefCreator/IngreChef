import { Request, Response } from 'express';

import type { RecipeFilters } from '../recipe/recipeTypes';

import CookbookService from './cookbookService';

const cookbookService = new CookbookService();

export default class CookbookController {
  constructor() {}

  async getCookbooks(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;

      const cookbooks = await cookbookService.getCookbooks(userId);
      res.status(200).json(cookbooks);
    } catch(error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка получения кулинарных книг" });
    }
  }
  async getCookbook(req: Request, res: Response): Promise<void> {
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
      console.error(error);
      res.status(500).json({ message: "Ошибка получения кулинарной книги" });
    }
  }
  async removeRecipeFromCookbook(req: Request, res: Response): Promise<void> {
    try {
      const cookbookId = req.params.cookbookId;

      const userId = req.body.userId as string;
      const recipeId = req.body.recipeId as string;

      const deletedRecipe = await cookbookService.removeRecipeFromCookbook(userId, cookbookId, recipeId);
      res.status(200).json(deletedRecipe);
    } catch(error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка получения кулинарной книги" });
    }
  }
  async addRecipeToCookbook(req: Request, res: Response): Promise<void> {
    try {
      const cookbookId = req.params.cookbookId;

      const userId = req.body.userId as string;
      const recipeId = req.body.recipeId as string;

      const addededRecipe = await cookbookService.addRecipeToCookbook(userId, cookbookId, recipeId);
      res.status(200).json(addededRecipe);
    } catch(error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка получения кулинарной книги" });
    }
  }
}