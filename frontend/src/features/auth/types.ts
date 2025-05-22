export interface InitialState {
  user: User | null;
  isAuth: boolean;
  accessToken: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isActivated: boolean;
  subscription?: "free" | "premium";
}