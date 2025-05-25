import { Request, Response, NextFunction } from 'express';

import IngredientService from './ingredientService';

const ingredientService = new IngredientService();

export default class IngredientController {
  constructor() {}

  async getIngredients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = (req.query.query as string) || "";

      const ingredients = await ingredientService.getIngredients(query);
      res.status(200).json(ingredients);
    } catch(error) {
      next(error);
    }
  }
}