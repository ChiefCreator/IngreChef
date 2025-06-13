export interface Filter {
  titleStartsWith?: string;
  category?: string;
  difficulty?: string;
  cuisine?: string;
  cookingTime?: {
    from: number;
    to: number;
  };
  ingredients?: string[];
  isFavorite?: boolean;
}

export interface PaginationOptions {
  cursor?: string;
  limit: number;
}

export interface QueryRecipeFilter extends PaginationOptions, Filter {
  userId?: string;
}