import { Filter } from "./recipeTypes";
import { prisma } from "./../../../server";

import DatabaseError from "../../../errors/DatabaseError";
import NotFoundError from "../../../errors/NotFoundError";
import { throwError } from "../../lib/error";
import { buildPrismaRecipeFilter } from "../../utils/filterUtils";
import type { QueryRecipeFilter } from "./recipeTypes";

export default class RecipeService {
  constructor() {};

  async getAllRecipes(userId: string, filters: QueryRecipeFilter) {
    try {
      const { cursor, limit } = filters;

      const take = Number(limit) + 1;  
      const where: any = buildPrismaRecipeFilter(userId, filters);
  
      let recipes = await prisma.recipe.findMany({
        where,
        take,
        ...(cursor && { skip: 1, cursor: { id: cursor }}),
        orderBy: { createdAt: "desc" },
        include: {
          likedBy: {
            where: {
              userId,
            },
            select: {
              recipeId: true,
            }
          }
        }
      });

      recipes.map(({ likedBy, ...recipe }) => ({
        ...recipe,
        isFavorite: likedBy.length > 0,
      }));

      const hasMore = recipes.length > limit;
      if (hasMore) recipes.pop();

      return {
        recipes,
        nextCursor: hasMore ? recipes[recipes.length - 1].id : null,
      };
    } catch (error) {
      throwError(error, new DatabaseError("Не удалось получить рецепты", error));
    }
  }
  async getUserRecipes(userId: string, filters: QueryRecipeFilter) {
    try {
      const { cursor, limit } = filters;
  
      const take = Number(limit) + 1;  
      const where: any = buildPrismaRecipeFilter(userId, filters);

      if (userId) {
        where.authorId = userId;
      }
  
      let recipes = await prisma.recipe.findMany({
        where,
        take,
        ...(cursor && { skip: 1, cursor: { id: cursor }}),
        orderBy: { createdAt: "desc" },
        include: {
          likedBy: {
            where: {
              userId,
            },
            select: {
              recipeId: true,
            }
          }
        }
      });
  
      recipes.map(({ likedBy, ...recipe }) => ({
        ...recipe,
        isFavorite: likedBy.length > 0,
      }));
   
      const hasMore = recipes.length > limit;
      if (hasMore) recipes.pop();

      return {
        recipes,
        nextCursor: hasMore ? recipes[recipes.length - 1].id : null,
      };
    } catch (error) {
      throwError(error, new DatabaseError("Не удалось получить рецепты пользователя", error, { userId }));
    }
  }
  async getRecipe(userId: string, recipeId: string) {
    try {
      const recipe = await prisma.recipe.findUnique({
        where: {
          id: recipeId,
        },
        include: {
          likedBy: {
            where: {
              userId
            }
          }
        }
      });
  
      if (!recipe) {
        throw new NotFoundError("Рецепт не найден", { recipeId });
      }

      const recipeWithIsFavorite = { ...recipe, isFavorite: !!recipe?.likedBy.length };
  
      return recipeWithIsFavorite;
    } catch (error) {
      throwError(error, new DatabaseError("Не удалось получить рецепт", error, { userId, recipeId }));
    }
  }

  async selectGeneratedRecipe(userId: string, recipeId: string) {
    try {
      const tempRecipe = await prisma.tempRecipe.findUnique({
        where: { id: recipeId },
      });

      if (!tempRecipe) {
        throw new NotFoundError("Рецепт не найден", { recipeId });
      }

      const recipe = await prisma.recipe.create({
        data: {
          ...tempRecipe,
          steps: tempRecipe.steps!,
        }
      });

      await prisma.tempRecipe.deleteMany({
        where: { authorId: userId },
      });
  
      return recipe;
    } catch (error) {
      throwError(error, new DatabaseError("Не удалось выбрать рецепт", error));
    }
  }
}
