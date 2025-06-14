import { prisma } from "./../../../server";

import { transformRecipeToClientRecipe } from "../../utils/recipeUtils";

import DatabaseError from "../../../errors/DatabaseError";
import NotFoundError from "../../../errors/NotFoundError";
import { throwError } from "../../utils/error";
import { buildPrismaRecipeFilter } from "../../utils/filterUtils";
import type { PaginationOptions, Filter } from "./recipeTypes";

export default class RecipeService {
  constructor() {};

  async getAllRecipes(userId: string, pagination: PaginationOptions, filters: Filter) {
    try {
      const { cursor, limit } = pagination;

      const take = limit + 1;  
      const where: any = buildPrismaRecipeFilter(userId, filters);
  
      const recipes = await prisma.recipe.findMany({
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

      const clientRecipes = recipes.map(transformRecipeToClientRecipe);
   
      const hasMore = clientRecipes.length > limit;
      if (hasMore) clientRecipes.pop();

      return {
        recipes: clientRecipes,
        nextCursor: hasMore ? clientRecipes[clientRecipes.length - 1].id : null,
      };
    } catch (error) {
      throwError(error, new DatabaseError("Не удалось получить рецепты", error));
    }
  }
  async getUserRecipes(userId: string, pagination: PaginationOptions, filters: Filter) {
    try {
      const { cursor, limit } = pagination;
  
      const take = limit + 1;  
      const where: any = buildPrismaRecipeFilter(userId, filters);

      if (userId) {
        where.authorId = userId;
      }
  
      const recipes = await prisma.recipe.findMany({
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
  
      const clientRecipes = recipes.map(transformRecipeToClientRecipe);
   
      const hasMore = clientRecipes.length > limit;
      if (hasMore) clientRecipes.pop();

      return {
        recipes: clientRecipes,
        nextCursor: hasMore ? clientRecipes[clientRecipes.length - 1].id : null,
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
  
      return transformRecipeToClientRecipe(recipe);
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
        },
        include: {
          likedBy: {
            where: {
              userId
            }
          }
        }
      });

      await prisma.tempRecipe.deleteMany({
        where: { authorId: userId },
      });
  
      return transformRecipeToClientRecipe(recipe);
    } catch (error) {
      throwError(error, new DatabaseError("Не удалось выбрать рецепт", error));
    }
  }
}
