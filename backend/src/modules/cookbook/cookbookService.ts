import { prisma } from "./../../../server";

import { buildPrismaRecipeFilter } from "../../utils/filterUtils";
import type { Filter, PaginationOptions } from '../recipe/recipeTypes';
import { transformRecipeToClientRecipe } from "../../utils/recipeUtils";

import DatabaseError from "../../../errors/DatabaseError";
import NotFoundError from "../../../errors/NotFoundError";
import { throwError } from "../../utils/error";

export default class CookbookService {
  constructor() {};

  async getCookbooks(userId: string) {
    try {
      const cookbooks = await prisma.cookbook.findMany({
        where: { userId },
        include: {
          recipes: {
            select: {
              recipe: {
                include: {
                  likedBy: true
                }
              }
            },
          },
        }
      });
  
      return cookbooks.map(cookbook => ({ ...cookbook, recipes: cookbook.recipes.map(rec => transformRecipeToClientRecipe(rec.recipe))}));
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось получить кулинарные книги", error));
    }
  }
  async getCookbook(userId: string, cookbookId: string, pagination: PaginationOptions, filters: Filter) {
    try {
      const { cursor, limit } = pagination;

      const take = limit + 1; 

      const cookbook = await prisma.cookbook.findUnique({
        where: { id: cookbookId },
        include: {
          recipes: {
            where: {
              recipe: buildPrismaRecipeFilter(userId, filters),
            },
            take,
            ...(cursor && { skip: 1, cursor: { id: cursor }}),
            select: {
              recipe: {
                include: {
                  likedBy: true
                }
              }
            }
          }
        },
      });

      const recipes = cookbook?.recipes.map(rec => transformRecipeToClientRecipe(rec.recipe)).sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()) ?? [];

      const hasMore = recipes.length > limit;
      if (hasMore) recipes.pop();

      const resCookbook = { ...cookbook, recipes }
  
      return { cookbook: resCookbook, nextRecipeCursor: hasMore ? recipes[recipes.length - 1].id : null };
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
