import type { Recipe } from "@prisma/client";

export type GenerateRecipeParams = Pick<Recipe, "description" | "category" | "difficulty" | "cuisine" | "cookingTime" | "ingredients">;