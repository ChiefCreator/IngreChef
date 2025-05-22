import type { User } from "../../auth/authSliceTypes";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginParams {
  email: string;
  password: string;
}
export interface RegisterParams extends LoginParams {
  name: string;
  terms: boolean;
}
export interface ActivateParams {
  activationCode: string;
}