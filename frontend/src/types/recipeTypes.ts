export type Category = "soups" | "main-dishes" | "side-dishes" | "salads" | "snacks" | "desserts" | "bakery-products";
export type Difficulty = "easy" | "medium" | "hard";
export type Cuisine = "Russian" | "Belarusian";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: Category;
  difficulty: Difficulty;
  cuisine: Cuisine;
  cookingTime: number;
  ingredients: string[];
  steps: string[];
  createdAt: Date;
  authorId: string;
  likedBy?: FavoriteRecipes[];
}

export interface FavoriteRecipes {
  id: string;
  likedAt: Date;
  userId: string;
  recipeId: string;

  recipe?: Recipe;
}