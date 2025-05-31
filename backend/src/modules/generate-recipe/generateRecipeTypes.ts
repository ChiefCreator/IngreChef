import type { Recipe } from "@prisma/client";

export type GenerateRecipeParams = Pick<Recipe, "description" | "category" | "difficulty" | "cuisine" | "cookingTime" | "ingredients">;

export type RecipeImagePromptProps = Pick<Recipe, "title" | "description" | "ingredients">;