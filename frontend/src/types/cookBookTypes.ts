import type { Recipe } from "./recipeTypes";

interface ColorPalette {
  base: string;
  darker: string;
  lighter?: string;
  contrast?: string;
};

export interface Cookbook {
  id: string;
  name: string;
  imageUrl?: string;
  recipes: Recipe[] | [];
  createdAt?: string;
  colorPalette?: ColorPalette;
}