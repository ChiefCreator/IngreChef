import { prisma } from "../../../server";

import DatabaseError from "../../../errors/DatabaseError";
import { throwError } from "../../lib/error";

export default class Service {
  constructor() {};

  async addFavorite(userId: string, recipeId: string) {
    try {
      const favorite = await prisma.favoriteRecipes.create({
        data: {
          userId,
          recipeId,
        },
      });
  
      return favorite;
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось добавить рецепт в избранное", error, { recipeId }));
    }
  }
  async deleteFavorite(userId: string, recipeId: string) {
    try {
      return prisma.favoriteRecipes.delete({
        where: {
          userId_recipeId: {
            userId,
            recipeId,
          }
        },
      });
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось удалить рецепт из избранного", error, { recipeId }));
    }
  }
}
