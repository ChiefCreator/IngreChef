import { prisma } from "./../../../server";

import type { RecipeFilters } from '../recipe/recipeTypes';
import { buildSingleCookbookIncludeClause } from "./../../lib/filterUtils";


export default class CookbookService {
  constructor() {};

  async getCookbooks(userId: string) {
    const cookbooks = await prisma.cookbook.findMany({
      where: {
        userId,
      },
      include: {
        recipes: {
          select: {
            recipe: true
          },
        },
      }
    });

    return cookbooks.map(cookbook => ({ ...cookbook, recipes: cookbook.recipes.map(rec => rec.recipe)}));
  }
  async getCookbook(cookbookId: string, filters: RecipeFilters) {
    const include = buildSingleCookbookIncludeClause(filters);

    const cookbook = await prisma.cookbook.findUnique({
      where: {
        id: cookbookId,
      },
      include,
    });

    return { ...cookbook, recipes: cookbook?.recipes.map(rec => rec.recipe)};
  }

  async removeRecipeFromCookbook(userId: string, cookbookId: string, recipeId: string) {
    const userSavedRecipe = await prisma.userSavedRecipe.findFirst({
      where: {
        userId,
        recipeId,
        cookbook: {
          id: cookbookId,
        },
      },
      select: {
        recipe: true,
      },
    });
  
    if (!userSavedRecipe || !userSavedRecipe.recipe) {
      throw new Error('Рецепт не найден в указанной книге пользователя.');
    }
  
    const recipe = userSavedRecipe.recipe;

    await prisma.cookbook.update({
      where: {
        userId,
        id: cookbookId,
      },
      data: {
        recipes: {
          disconnect: {
            userId_recipeId_cookbookId: {
              userId,
              recipeId,
              cookbookId,
            }
          }
        },
      },
    });

    return recipe;
  }
  async addRecipeToCookbook(userId: string, cookbookId: string, recipeId: string) {
    const userSavedRecipe = await prisma.userSavedRecipe.create({
      data: {
        userId,
        recipeId,
        cookbookId,
      },
    });

    return userSavedRecipe;
  }
}
