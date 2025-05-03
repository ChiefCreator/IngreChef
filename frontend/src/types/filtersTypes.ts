import { Category, Difficulty, Cuisine } from "./recipeTypes";

export interface Filter {
  titleStartsWith?: string;
  category?: Category;
  difficulty?: Difficulty;
  cuisine?: Cuisine;
  cookingTime?: {
    from: number;
    to: number;
  };
  ingredients?: string[];
  isFavorite?: boolean;
}

export type ChangeFilter = <K extends keyof Filter>(key: K, value: Filter[K]) => void;
export type ChangeFilterWithoutKey = <K extends keyof Filter>(value: Filter[K]) => void;