
import type { Difficulty, Category, Cuisine } from "../types/recipeTypes";

interface RecipeOptions {
  difficulty: {
    label: string;
    value: Difficulty;
  }[];
  category: {
    label: string;
    value: Category;
  }[];
  cuisine: {
    label: string;
    value: Cuisine;
  }[];
}

export const recipeOptions: RecipeOptions = {
  difficulty: [
    { 
      label: "Легкая",
      value: "easy",
    },
    { 
      label: "Средняя",
      value: "medium",
    },
    { 
      label: "Тяжелая",
      value: "hard",
    },
  ],
  category: [
    { 
      label: "Супы",
      value: "soups",
    },
    { 
      label: "Основные блюда",
      value: "main-dishes",
    },
    { 
      label: "Гарниры",
      value: "side-dishes",
    },
    { 
      label: "Салаты",
      value: "salads",
    },
    { 
      label: "Закуски",
      value: "snacks",
    },
    { 
      label: "Дессерты",
      value: "desserts",
    },
    { 
      label: "Хлебобулочные изделия",
      value: "bakery-products",
    },
  ],
  cuisine: [
    { 
      label: "Русская кухня",
      value: "russian",
    },
    { 
      label: "Белорусская кухня",
      value: "belarusian",
    },
  ]
}