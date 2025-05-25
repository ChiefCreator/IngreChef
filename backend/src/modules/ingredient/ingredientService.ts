import { prisma } from "../../../server";

import DatabaseError from "../../../errors/DatabaseError";
import { throwError } from "../../lib/error";

export default class IngredientService {
  constructor() {};

  async getIngredients(query: string) {
    try {
      const ingredients = await prisma.ingredient.findMany({
        where: {
          title: {
            startsWith: query,
            mode: "insensitive", 
          }
        },
      });

      return ingredients
    } catch (error) {
      throwError(error, new DatabaseError("Не удалось получить ингредиенты", error));
    }
  }
}
