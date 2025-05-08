import { RecipeFilters } from "./recipeTypes";
import { prisma } from "./../../../server";

export default class RecipeService {
  constructor() {};

  async getAllRecipes(filters: RecipeFilters) {
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

    return prisma.recipe.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {likedBy: true}
    });
  }
  async getUserRecipes(filters: RecipeFilters) {
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

    return prisma.recipe.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCookbookIdsOfUserRecipe(recipeId: string) {
    const userSavedRecipes = await prisma.userSavedRecipe.findMany({
      where: {
        recipeId,
      },
      select: {
        cookbook: true,
      }
    });

    const cookbookIds = userSavedRecipes?.map(userSavedRecipe => userSavedRecipe.cookbook?.id).filter(Boolean);;

    return cookbookIds;
  }

  async getFavoriteRecipesIds(userId: string) {
    const favorites = await prisma.favoriteRecipes.findMany({
      where: {
        userId,
      },
      select: { recipeId: true },
    });

    return favorites.map((fav) => fav.recipeId);
  }
  async toggleFavoriteRecipe(userId: string, recipeId: string) {
    const isRecipeExist = await prisma.favoriteRecipes.findUnique({
      where: {
        userId_recipeId: { userId, recipeId },
      },
    });

    if (isRecipeExist) {
      const data = await prisma.favoriteRecipes.delete({
        where: {
          userId_recipeId: { userId, recipeId },
        },
      });

      return { status: "removed", data };
    } else {
      const data = await prisma.favoriteRecipes.create({
        data: {
          userId,
          recipeId,
        }
      });

      return { status: "added", data };
    }
  }
}
