export interface RecipeFilters {
  userId: string;
  page: number;
  limit: number;

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
