import { Request, Response, NextFunction } from 'express';

const categoryMap: { [key: string]: string } = {
  soups: "SOUPS",
  "main-dishes": "MAIN_DISHES",
  'side-dishes': "SIDE_DISHES",
  salads: "SALADS",
  snacks: "SNACKS",
  desserts: "DESSERTS",
  "bakery-products": "BAKERY-PRODUCTS",
};

export const transformQueryGetAllRecipesParams = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const {
      category,
      difficulty,
      cuisine,
    } = req.query;

    if (category) {
      const categoryLowercase = (category as string).toLowerCase();
      
      if (categoryMap[categoryLowercase]) {
        req.query.category = categoryMap[categoryLowercase];
      }
    }

    if (difficulty) {
      req.query.difficulty = (difficulty as string).toUpperCase();
    }

    if (cuisine) {
      req.query.cuisine = (cuisine as string).toUpperCase();
    }

    next();
  } catch (error) {
    console.error("Ошибка преобразования параметров запроса", error);
    res.status(400).json({ message: "Ошибка преобразования параметров запроса" });
  }
};
