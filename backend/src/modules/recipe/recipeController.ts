import { Request, Response } from 'express';
import { RecipeFilters } from "./recipeTypes";

import RecipeService from './recipeService';

const recipeService = new RecipeService();

export default class RecipeController {
  constructor() {}

  async getAllRecipes(req: Request, res: Response): Promise<void> {
    try {
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

      const recipes = await recipeService.getAllRecipes(filters);
      res.status(200).json(recipes);
    } catch(error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка получения рецептов' });
    }
  }
  async getFavoriteRecipesIds(req: Request, res: Response): Promise<void> {
    try {
      const userId = String(req.query.userId);

      const recipesIds = await recipeService.getFavoriteRecipesIds(userId);
      res.status(200).json(recipesIds);
    } catch(error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка получения рецептов' });
    }
  }
  async toggleFavoriteRecipesIds(req: Request, res: Response): Promise<void> {
    try {
      const userId = String(req.body.userId);
      const recipeId = String(req.body.recipeId);

      const recipe = await recipeService.toggleFavoriteRecipe(userId, recipeId);
      const newRecipesIds = await recipeService.getFavoriteRecipesIds(userId);
      res.status(200).json(newRecipesIds);
    } catch(error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка получения рецептов' });
    }
  }
}