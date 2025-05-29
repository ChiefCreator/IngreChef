import { RecipeFilters } from "./recipeTypes";
import { prisma } from "./../../../server";

import DatabaseError from "../../../errors/DatabaseError";
import NotFoundError from "../../../errors/NotFoundError";
import { throwError } from "../../lib/error";

export default class RecipeService {
  constructor() {};

  async getAllRecipes(filters: RecipeFilters) {
    try {
      const {
        userId,
        page,
        limit,
        titleStartsWith,
        category,
        difficulty,
        cuisine,
        cookingTime,
        ingredients,
        isFavorite,
      } = filters;
  
      const skip = (page - 1) * limit;
    
      const where: any = {};
  
      if (titleStartsWith) {
        where.title = {
          startsWith: titleStartsWith,
          mode: "insensitive",
        };
      }
      if (category) {
        where.category = category;
      }
      if (difficulty) {
        where.difficulty = difficulty;
      }
      if (cuisine) {
        where.cuisine = cuisine;
      }
      if (cookingTime) {
        where.cookingTime = { 
          gte: cookingTime.from,
          lte: cookingTime.to,
        };
      }
      if (ingredients && ingredients.length > 0) {
        where.ingredients = {
          hasEvery: ingredients,
        };
      }
      if (isFavorite) {
        where.likedBy = {
          some: {
            userId: userId,
          },
        };
      }
  
      const recipes = await prisma.recipe.findMany({
        where,
        skip,
        take: limit,
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

      return recipes.map(({ likedBy, ...recipe }) => ({
        ...recipe,
        isFavorite: likedBy.length > 0,
      }));
    } catch (error) {
      throwError(error, new DatabaseError("Не удалось получить рецепты", error));
    }
  }
  async getUserRecipes(filters: RecipeFilters) {
    const {
      userId,
      page = 1,
      limit = 10,
      titleStartsWith,
      category,
      difficulty,
      cuisine,
      cookingTime,
      ingredients,
      isFavorite,
    } = filters;

    const skip = (page - 1) * limit;
  
    const where: any = {};

    where.authorId = userId;

    if (titleStartsWith) {
      where.title = {
        startsWith: titleStartsWith,
        mode: "insensitive",
      };
    }
    if (category) {
      where.category = category;
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }
    if (cuisine) {
      where.cuisine = cuisine;
    }
    if (cookingTime) {
      where.cookingTime = { 
        gte: cookingTime.from,
        lte: cookingTime.to,
      };
    }
    if (ingredients && ingredients.length > 0) {
      where.ingredients = {
        hasEvery: ingredients,
      };
    }
    if (isFavorite) {
      where.likedBy = {
        some: {
          userId: userId,
        },
      };
    }

    try {
      return prisma.recipe.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
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
