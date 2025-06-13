import type { ParsedQs } from "qs";
import type { Filter, QueryRecipeFilter } from "../modules/recipe/recipeTypes";

export function mapQueryToFilters(query: ParsedQs): QueryRecipeFilter {
  const {
    cursor,
    limit,
    titleStartsWith,
    category,
    difficulty,
    cuisine,
    cookingTime,
    ingredients,
    isFavorite,
  } = query;  
  
  return {
    cursor: (cursor !== "undefined" ? cursor : undefined) as string | undefined,
    limit: Number(limit),
    titleStartsWith: titleStartsWith as string | undefined,
    category: category as string | undefined,
    difficulty: difficulty as string | undefined,
    cuisine: cuisine as string | undefined,
    cookingTime: cookingTime ? JSON.parse(cookingTime as string) as QueryRecipeFilter["cookingTime"] : undefined,
    ingredients: ingredients ? ingredients as string[] : undefined,
    isFavorite: isFavorite === "true",
  };
}

export function buildPrismaRecipeFilter(userId: string, { titleStartsWith, category, difficulty, cuisine, cookingTime, ingredients, isFavorite }: Filter) { 
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
        userId,
      },
    };
  }

  return where;
}