import { Request, Response, NextFunction } from 'express';
import { mapQueryToFilters } from '../../utils/filterUtils';

import RecipeService from './recipeService';

const recipeService = new RecipeService();

import { denormalizeEnumFields } from '../../middleware/normalizeEnumFields';
import BadRequestError from '../../../errors/BadRequestError';

export default class RecipeController {
  constructor() {}

  async getAllRecipes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        throw new BadRequestError("Поле userId обязательно", { field: "userId" });
      }  

      const filters = mapQueryToFilters(req.query);

      const result = await recipeService.getAllRecipes(userId, filters);
      const transformedRecipes = result.recipes?.map(o => denormalizeEnumFields(o, ["category", "difficulty", "cuisine"]));

      res.status(200).json({ recipes: transformedRecipes, nextCursor: result.nextCursor });
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

      const filters = mapQueryToFilters(req.query);

      const result = await recipeService.getUserRecipes(userId, filters);
      const transformedRecipes = result.recipes?.map(o => denormalizeEnumFields(o, ["category", "difficulty", "cuisine"]));

      res.status(200).json({ recipes: transformedRecipes, nextCursor: result.nextCursor });
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
      const transformedRecipe = denormalizeEnumFields(recipe, ["cuisine", "difficulty", "category"]);

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
      const transformedRecipe = denormalizeEnumFields(recipe, ["cuisine", "difficulty", "category"]);

      res.status(200).json(transformedRecipe);
    } catch(error) {
      next(error);
    }
  }
}