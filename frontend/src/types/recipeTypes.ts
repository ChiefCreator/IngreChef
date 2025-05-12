import type { MenuItem } from "../components/RecipeMenu/RecipeMenu";

export type Category = "soups" | "main-dishes" | "side-dishes" | "salads" | "snacks" | "desserts" | "bakery-products";
export type Difficulty = "easy" | "medium" | "hard";
export type Cuisine = "russian" | "belarusian";

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
  steps: { title: string; time: number; description: string }[];
  createdAt: Date;
  authorId: string;
  isFavorite: boolean;
  likedBy?: FavoriteRecipes[];
}

export interface FavoriteRecipes {
  id: string;
  likedAt: Date;
  userId: string;
  recipeId: string;

  recipe?: Recipe;
}

export interface RecipeCardOfMyRecipesOptions {
  [key: string]: MenuItem[];
}

export interface RecipeCardOfCookbookOptions {
  [key: string]: MenuItem[];
}