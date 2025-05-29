import { Request, Response, NextFunction } from 'express';
import { RecipeFilters } from "./recipeTypes";

import RecipeService from './recipeService';

const recipeService = new RecipeService();

import { transformRecipeFromDBToClient } from '../../middleware/transformQueryGetAllRecipesParams';
import BadRequestError from '../../../errors/BadRequestError';

export default class RecipeController {
  constructor() {}

  async getAllRecipes(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      if (!userId) {
        throw new BadRequestError("Поле userId обязательно", { field: "userId" });
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

      const recipes = await recipeService.getAllRecipes(filters);
      res.status(200).json(recipes);
    } catch(error) {
      next(error);
    }
  }
  async getUserRecipes(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      if (!userId) {
        throw new BadRequestError("Поле userId обязательно", { field: "userId" })
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

      const userRecipes = await recipeService.getUserRecipes(filters);
      res.status(200).json(userRecipes);
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
      const transformedRecipe = transformRecipeFromDBToClient(recipe);

      res.status(200).json(transformedRecipe);
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
      const transformedRecipe = transformRecipeFromDBToClient(recipe);

      res.status(200).json(transformedRecipe);
    } catch(error) {
      next(error);
    }
  }
}