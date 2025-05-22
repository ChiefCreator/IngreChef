import type { User } from "../auth/types";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface GetRecipeParams {
  userId: string;
  recipeId: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest extends LoginRequest {
  name: string;
  terms: boolean;
}