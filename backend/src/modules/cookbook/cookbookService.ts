import { prisma } from "./../../../server";

import type { QueryRecipeFilter } from '../recipe/recipeTypes';
import { buildSingleCookbookIncludeClause } from "./../../lib/filterUtils";

import DatabaseError from "../../../errors/DatabaseError";
import NotFoundError from "../../../errors/NotFoundError";
import { throwError } from "../../lib/error";

export default class CookbookService {
  constructor() {};

  async getCookbooks(userId: string) {
    try {
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
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось получить кулинарные книги", error));
    }
  }
  async getCookbook(cookbookId: string, filters: QueryRecipeFilter) {
    try {
      const include = buildSingleCookbookIncludeClause(filters);

      const cookbook = await prisma.cookbook.findUnique({
        where: {
          id: cookbookId,
        },
        include,
      });
  
      return { ...cookbook, recipes: cookbook?.recipes.map(rec => rec.recipe)};
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось получить кулинарную книгу", error, { cookbookId }));
    }
  }
  async createCookbook(userId: string, cookbookId: string, name: string, colorPalette: string) {
    try {
      const cookbook = await prisma.cookbook.create({
        data: {
          id: cookbookId,
          userId,
          name,
          colorPalette,
        },
      });
  
      return cookbook;
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось создать кулинарную книгу", error));
    }
  }

  async addRecipeToCookbook(userId: string, cookbookId: string, recipeId: string) {
    try {
      const userSavedRecipe = await prisma.userSavedRecipe.create({
        data: {
          userId,
          recipeId,
          cookbookId,
        },
      });
  
      return userSavedRecipe;
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось добавить рецепт в кулинарную книгу", error, { userId, recipeId, cookbookId }));
    }
  }
  async removeRecipeFromCookbook(userId: string, cookbookId: string, recipeId: string) {
    try {
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
        throw new NotFoundError("Рецепт не найден в указанной книге пользователя");
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
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось удалить рецепт из кулинарной книги", error, { userId, recipeId, cookbookId }));
    }
  }
}
