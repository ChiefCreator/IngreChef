import { prisma } from "../../../server";

import DatabaseError from "../../../errors/DatabaseError";

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
      throw new DatabaseError("Не удалось добавить рецепт в избранное", error as Error, { recipeId });
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
      throw new DatabaseError("Не удалось удалить рецепт из избранного", error as Error, { recipeId });
    }
  }
}
