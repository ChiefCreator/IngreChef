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

export interface ApiError {
  status: number;
  data: {
    message: string;
    [key: string]: any;
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "data" in error &&
    typeof (error as any).data === "object"
  );
}