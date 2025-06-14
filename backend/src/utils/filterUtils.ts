import type { ParsedQs } from "qs";
import type { Filter, PaginationOptions, QueryRecipeFilter } from "../modules/recipe/recipeTypes";

export function mapQueryToFilters(query: ParsedQs): Filter {
  const {
    titleStartsWith,
    category,
    difficulty,
    cuisine,
    cookingTime,
    ingredients,
    isFavorite,
  } = query;  
  
  return {
    titleStartsWith: titleStartsWith as string | undefined,
    category: category as string | undefined,
    difficulty: difficulty as string | undefined,
    cuisine: cuisine as string | undefined,
    cookingTime: cookingTime ? JSON.parse(cookingTime as string) as QueryRecipeFilter["cookingTime"] : undefined,
    ingredients: ingredients ? ingredients as string[] : undefined,
    isFavorite: isFavorite === "true",
  };
}
export function mapQueryToPaginationOptions(query: ParsedQs): PaginationOptions {
  const { cursor, limit } = query;  
  
  return {
    cursor: (cursor !== "undefined" ? cursor : undefined) as string | undefined,
    limit: Number(limit),
  };
}

export function buildPrismaRecipeFilter(userId: string, { titleStartsWith, category, difficulty, cuisine, cookingTime, ingredients, isFavorite }: Filter) { 
  const filter: any = {};  

  if (titleStartsWith) {
    filter.title = {
      startsWith: titleStartsWith,
      mode: "insensitive",
    };
  }
  if (category) {
    filter.category = category;
  }
  if (difficulty) {
    filter.difficulty = difficulty;
  }
  if (cuisine) {
    filter.cuisine = cuisine;
  }
  if (cookingTime) {
    filter.cookingTime = { 
      gte: cookingTime.from,
      lte: cookingTime.to,
    };
  }
  if (ingredients && ingredients.length > 0) {
    filter.ingredients = {
      hasEvery: ingredients,
    };
  }
  if (isFavorite) {
    filter.likedBy = {
      some: {
        userId,
      },
    };
  }

  return filter;
}