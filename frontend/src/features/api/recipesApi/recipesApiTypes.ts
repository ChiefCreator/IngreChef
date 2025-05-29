import type { Recipe } from "../../../types/recipeTypes";

export interface GetRecipeParams {
  userId: string;
  recipeId: string;
}

export interface AddRecipeParams {
  userId: string;
  recipeId: string;
}

export interface FavoriteRecipeResponse {
  id: string;
  likedAt: string;
  userId: string;
  recipeId: string;
}
export interface FavoriteRecipeParams {
  userId: string;
  recipeId: string;
}

export type GenerateRecipeParams = Partial<Pick<Recipe, "description" | "category" | "difficulty" | "cuisine" | "cookingTime" | "ingredients" | "authorId">>;