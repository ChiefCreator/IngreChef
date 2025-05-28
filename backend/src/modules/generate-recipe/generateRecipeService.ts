import { prisma } from "../../../server";
import { OpenAI } from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import DatabaseError from "../../../errors/DatabaseError";
import ValidationError from "../../../errors/ValidationError";
import { throwError } from "../../lib/error";

import type { GenerateRecipeParams } from "./GenerateRecipeTypes";
import { GeneratedRecipeSchema } from "./generateRecipeSchema";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default class GenerateRecipeService {
  constructor() {};

  async generateRecipe(authorId: string, recipeParams: GenerateRecipeParams) {
    try {
      const instructions = this.createAssistantInstructions();
      const prompt = this.createPrompt(recipeParams);

      const aiResponse = await client.responses.parse({
        model: "gpt-4.1-nano",
        instructions,
        input: [
          { role: "user", content: prompt }
        ],
        temperature: 1,
        text: {
          format: zodTextFormat(GeneratedRecipeSchema, "generated_recipe_schema")
        }
      });

      const generatedRecipe = aiResponse.output_parsed;

      if (!generatedRecipe) {
        throw new ValidationError("Сгенерированный рецепт не соответствует схеме");
      }

      const savedRecipe = await prisma.recipe.create({
        data: {
          ...generatedRecipe,
          authorId,
        },
      });

      return savedRecipe;
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось сгенерировать рецепт", error));
    }
  }

  createAssistantInstructions() {
    return `
      Ты - профессиональный API-ассистент для генерации рецептов.
      Сгенерируй креативный рецепт на основе введеннных пользовательских данных.
      Коммуникационный стиль — строгий, машинный, без эмоций.
      
      # Инструкции
      
      На основе пользовательских параметров необходимо сгенерировать рецепт. Возможными параметрами являются: пожелания пользователя, категория блюда, сложность, кухня, время приготовления, ингредиенты.
      Если пользователь не указал ни одного параметра, то необходимо сгенерировать случайный рецепт.
      
      Список ингредиентов должен включать в себя количество и название каждого ингредиента.
      Все указанные ингредиенты должны использоваться в рецепте (самих ингредиентов может быть любое количество).
      Шаги приготовления должны включать в себя название, описание и время каждого шага.
      Параметр время приготовление генерируется в минутах и не должен превышать заданное пользователем. Оно должно отражать реальное время приготовления блюда (чтобы не было такого, чтобы простое блюдо готовилось 300 минут).
      Суммарное время всех шагов должно равняться времени приготовления.
      Рецепт должен быть реалистичным и приготовленным только из съедобных ингредиентов.
      В рецепте должен быть кулинарный смысл: никаких выдуманных или абсурдных ингредиентов, инструментов или этапов приготовления.
      Используй только разумные сочетания ингредиентов (не используй шоколадный рыбный суп и т.д.).
      Если пожелания или введенные ингредиенты не позволяют сформировать реальный рецепт, то генерируй случайный в JSON-формате.
      
      # Формат вывода
      
      1. Необходимо всегда выводить только JSON-объект (даже, если пользователь не указал никаких параметров, и если не получается сформировать реальный рецепт, то не писать, что невозможно сгенерировать рецепт).
      2. JSON-объект строго должен иметь следующий вид:
      
      {
        "title": string,
        "description": string,
        "category": "SOUPS" | "MAIN_DISHES" | "SIDE_DISHES" | "SALADS" | "SNACKS" | "DESSERTS" | "BAKERY_PRODUCTS",    
        "difficulty": "EASY" | "MEDIUM" | "HARD",
        "cuisine": "RUSSIAN" | "BELARUSIAN",   
        "cookingTime": number,
        "ingredients": string[],
        "steps": [
          {
            "title": string, 
            "time": number,          
            "description": string
          }
        ]
      }
    `;
  }
  createPrompt({ category, difficulty, cuisine, ingredients, cookingTime, description }: GenerateRecipeParams) {
    return `
      Пожелания: ${description}
      Категория: ${category}
      Сложность: ${difficulty}
      Кухня: ${cuisine}
      Время приготовления: ${cookingTime}
      Ингредиенты: ${ingredients?.join(", ")}
    `;
  }
}
