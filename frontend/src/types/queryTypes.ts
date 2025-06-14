import { Filter } from "./filtersTypes";

export interface PaginationOptions {
  cursor?: string;
  limit?: number;
}

export interface QueryRecipeFilter {
  userId?: string;
  cookbookId?: string;
  
  pagination?: PaginationOptions;
  filters?: Filter;
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