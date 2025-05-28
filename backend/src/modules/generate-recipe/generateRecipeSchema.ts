import { z } from "zod";

export const GeneratedRecipeStepSchema = z.object({
  title: z.string(),
  time: z.number().int().positive(),
  description: z.string(),
});

export const GeneratedRecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(["SOUPS", "MAIN_DISHES", "SIDE_DISHES", "SALADS", "SNACKS", "DESSERTS", "BAKERY_PRODUCTS"]),
  difficulty: z.enum(["EASY",  "MEDIUM",  "HARD"]),
  cuisine: z.enum(["RUSSIAN", "BELARUSIAN"]),
  cookingTime: z.number().int().positive(),
  ingredients: z.array(z.string()),
  steps: z.array(GeneratedRecipeStepSchema),
});

export type GeneratedRecipe = z.infer<typeof GeneratedRecipeSchema>;
