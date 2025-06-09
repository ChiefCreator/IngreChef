import { prisma } from "../../../server";

import { denormalizeEnumFields } from "../../middleware/normalizeEnumFields";

import DatabaseError from "../../../errors/DatabaseError";
import NotFoundError from "../../../errors/NotFoundError";
import { throwError } from "../../lib/error";

import type { UserProfileData } from './userTypes';
import type { Profile } from "@prisma/client";

export default class UserService {
  constructor() {};

  async getUser(userId: string, include: Record<string, boolean>) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include
      });

      if (!user) {
        throw new NotFoundError("Пользователь не найден");
      }

    const denormalizedProfile = user.profile ? denormalizeEnumFields(user.profile, ["gender", "cookingLevel"]) as Profile : null;

    return {
      ...user,
      profile: denormalizedProfile,
    };
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось получить пользователя", error, { userId }));
    }
  }
  async updateUserProfile(userId: string, updatedProfileFields: UserProfileData) {
    try {
      const profile = await prisma.profile.update({
        where: { userId },
        data: updatedProfileFields,
      });

      if (!profile) {
        throw new NotFoundError("Профиль пользователя отсутствует");
      }
  
      return profile;
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось обновить профиль пользователя", error, { userId }));
    }
  }
}
