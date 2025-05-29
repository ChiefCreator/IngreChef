import { NextFunction, Request, Response } from 'express';

import GenerateRecipeService from './generateRecipeService';
import BadRequestError from '../../../errors/BadRequestError';

import { transformRecipeFromDBToClient } from '../../middleware/transformQueryGetAllRecipesParams';

import type { GenerateRecipeParams } from './generateRecipeTypes';

const service = new GenerateRecipeService();

export default class GenerateRecipeController {
  constructor() {}

  async generateRecipes(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const tempRecipes = await service.generateRecipes(authorId, recipeParams);
      const transformedRecipes = tempRecipes?.map(o => transformRecipeFromDBToClient(o));

      res.status(200).json(transformedRecipes);
    } catch(error) {
      next(error);
    }
  }
}