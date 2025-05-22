export interface GetRecipeParams {
  userId: string;
  recipeId: string;
}

export interface FavoriteRecipeResponse {
  id: string;
  likedAt: string;
  userId: string;
  recipeId: string;
}
export interface FavoriteRecipeParams {
  userId: string;
  recipeId: string;
}