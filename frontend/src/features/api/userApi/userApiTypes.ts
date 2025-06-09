

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  activationCode?: string;
  isActivated: boolean;
  createdAt: Date;
  lastLogin?: Date;

  profile?: Profile;
}

export type Gender = "male" | "female" | "unspecified";
export type CookingLevel = "novice" | "intermediate" | "expert";

export interface ProfileSettings {
  gender?: Gender;
  age?: number;
  weight?: number;
  height?: number;
  cookingLevel?: CookingLevel;
  allergies?: string[];
  dietaryRestrictions?: string[];
}

export interface Profile extends ProfileSettings {
  id: string;
  name: string;
  avatarUrl?: string;
}

type IncludeUserRelation = "profile";

export interface GetUserParams {
  userId: string;
  include?: IncludeUserRelation[];
}

export interface UpdateProfileParams {
  userId: string;
  data?: Partial<Omit<Profile, "id">>;
}