import { prisma } from "./../../../server";

export default class CookbookService {
  constructor() {};

  async getCookbooks(userId: string) {
    const cookbooks = await prisma.cookbook.findMany({
      where: {
        userId,
      },
      include: {
        recipes: {
          select: {
            recipe: true
          },
        },
      }
    });

    return cookbooks.map(cookbook => ({ ...cookbook, recipes: cookbook.recipes.map(rec => rec.recipe)}));
  }
}
