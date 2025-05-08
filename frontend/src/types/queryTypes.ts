import { Filter } from "./filtersTypes";

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface RecipeQuery extends PaginationOptions, Filter {
  userId?: string;
};

export interface FavoriteRecipeQuery extends Filter {
  userId: string;
};

export interface CookbookQuery {
  userId: string;
}

export interface SingleCookbookQuery extends Filter {
  userId: string;
  cookbookId: string;
}