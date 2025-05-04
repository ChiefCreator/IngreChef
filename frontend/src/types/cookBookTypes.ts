import type { Recipe } from "./recipeTypes";

export interface Cookbook {
  id: string;
  name: string;
  imageUrl?: string;
  recipes: Recipe[] | [];
}