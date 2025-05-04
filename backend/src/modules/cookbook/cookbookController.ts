import { Request, Response } from 'express';

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
}