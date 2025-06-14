import type { Filter } from "../../../types/filtersTypes";
import type { Cookbook } from "../../../types/cookBookTypes";
import type { Recipe } from "../../../types/recipeTypes";

export interface getCookBooksParams {
  userId: string;
}

export interface getCookbookResponse {
  cookbook: Cookbook;
  nextRecipeCursor?: string;
}

export interface getCookBookParams extends Filter {
  userId: string;
  cookbookId: string;
}

export interface CreateCookbookParams {
  name: string;
  cookbookId: string;
  userId: string;
  colorPalette: Cookbook["colorPalette"];
}

export interface RemoveRecipeFromCookbookParams {
  userId: string,
  cookbookId: string;
  recipeId: string;
}

export interface AddRecipeToCookbookParams extends RemoveRecipeFromCookbookParams {
  recipe: Recipe;
}