import { Prisma } from "@prisma/client";

import { denormalizeEnumFields } from "../middleware/normalizeEnumFields";

type ClientRecipe = Prisma.RecipeGetPayload<{
  include: {
    likedBy: {
      where: {
        userId: string;
      },
      select: {
        recipeId: true;
      }
    }
  }
}>;

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
  authorId: string;
  createdAt?: Date;
  isFavorite?: boolean;
}


export function transformRecipeToClientRecipe(recipe: ClientRecipe): Recipe {
  const { likedBy, ...recipeProps } = recipe || {};

  const clientRecipe = denormalizeEnumFields(recipeProps, ["category", "difficulty", "cuisine"]) as Recipe;

  return {
    ...clientRecipe,
    isFavorite: likedBy.length > 0,
  }
}