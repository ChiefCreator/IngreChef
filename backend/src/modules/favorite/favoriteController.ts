import { Request, Response } from 'express';

import Service from './favoriteService';

const service = new Service();

export default class RecipeController {
  constructor() {}

  async addFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { userId, recipeId } = req.body;

      if (!userId || !recipeId) {
        res.status(400).json({ error: "userId и recipeId обязательны!" });
      }

      const favorite = await service.addFavorite(userId, recipeId);
      res.status(200).json(favorite);
    } catch(error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка добавления рецепта в избранное" });
    }
  }
  async deleteFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { userId, recipeId } = req.query;

      if (!userId || !recipeId) {
        res.status(400).json({ error: "userId и recipeId обязательны!" });
      }

      const deletedFavorite = await service.deleteFavorite(userId as string, recipeId as string);
      res.status(200).json(deletedFavorite);
    } catch(error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка добавления рецепта в избранное" });
    }
  }
}