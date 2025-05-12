import { prisma } from "../../../server";

export default class Service {
  constructor() {};

  async addFavorite(userId: string, recipeId: string) {
    const favorite = await prisma.favoriteRecipes.create({
      data: {
        userId,
        recipeId,
      },
    });

    return favorite;
  }
  async deleteFavorite(userId: string, recipeId: string) {
    return prisma.favoriteRecipes.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        }
      },
    });
  }
}
