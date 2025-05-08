import type { RecipeFilters } from "./../modules/recipe/recipeTypes";
import type { Prisma } from "@prisma/client";

export function buildRecipeWhereClause(filters: RecipeFilters) {
  const {
    titleStartsWith,
    category,
    difficulty,
    cuisine,
    cookingTime,
    ingredients,
    isFavorite,
    userId,
  } = filters;

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

  if (isFavorite && userId) {
    where.likedBy = {
      some: {
        userId,
      },
    };
  }

  return where;
}

export function buildSingleCookbookIncludeClause(filters: RecipeFilters): {
  recipes: {
    where: {
      recipe: Prisma.RecipeWhereInput
    }
    select: {
      recipe: true
    }
  }
} {
  const {
    titleStartsWith,
    category,
    difficulty,
    cuisine,
    cookingTime,
    ingredients,
    isFavorite,
    userId,
  } = filters;

  const include: any = {
    recipes: {
      where: { recipe: {  } },
      select: {
        recipe: true
      }
    }
  };
  
  const recipe = include.recipes.where.recipe;
  
  if (titleStartsWith) {
    recipe.title = {
      startsWith: titleStartsWith,
      mode: "insensitive",
    }
  }

  if (category) {
    recipe.category = category;
  }

  if (difficulty) {
    recipe.difficulty = difficulty;
  }

  if (cuisine) {
    recipe.cuisine = cuisine;
  }

  if (cookingTime) {
    recipe.cookingTime = {
      gte: cookingTime.from,
      lte: cookingTime.to,
    }
  }

  if (ingredients && ingredients.length > 0) {
    recipe.ingredients = {
      hasEvery: ingredients,
    }
  }

  if (isFavorite && userId) {
    recipe.likedBy = {
        some: {
        userId,
      }
    }
  }

  return include;
}