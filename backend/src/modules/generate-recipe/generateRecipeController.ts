import { NextFunction, Request, Response } from 'express';

import GenerateRecipeService from './GenerateRecipeService';
import BadRequestError from '../../../errors/BadRequestError';

import { transformRecipeFromDBToClient } from '../../middleware/transformQueryGetAllRecipesParams';

import type { GenerateRecipeParams } from './GenerateRecipeTypes';

const service = new GenerateRecipeService();

export default class GenerateRecipeController {
  constructor() {}

  async generateRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, difficulty, cuisine, ingredients, cookingTime, description, authorId } = req.body;

      if (!authorId) {
        throw new BadRequestError("Поле authorId обязательно"); 
      } 

      const recipeParams = {
        category: category,
        difficulty: difficulty,
        cuisine: cuisine,
        ingredients: ingredients,
        cookingTime: cookingTime,
        description: description,
      } as GenerateRecipeParams;

      const recipe = await service.generateRecipe(authorId, recipeParams);
      const transformedRecipe = transformRecipeFromDBToClient(recipe);

      res.status(200).json(transformedRecipe);
    } catch(error) {
      next(error);
    }
  }
}