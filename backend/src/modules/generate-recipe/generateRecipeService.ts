import { prisma } from "../../../server";
import { OpenAI } from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import * as fs from 'fs';
import * as path from 'path';

import DatabaseError from "../../../errors/DatabaseError";
import ValidationError from "../../../errors/ValidationError";
import { throwError } from "../../lib/error";
import { v4 } from "uuid";

import type { GenerateRecipeParams, RecipeImagePromptProps } from "./generateRecipeTypes";
import { GeneratedRecipesSchema } from "./generateRecipeSchema";
import AppError from "../../../errors/AppError";
import { UPLOAD_DIR } from "../../config/config";
import { ensureDirExists } from "../../utils/fileUtils";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default class GenerateRecipeService {
  constructor() {};

  async generateRecipes(authorId: string, recipeParams: GenerateRecipeParams) {
    try {
      const instructions = this.createInstructionsForRecipeGeneration();
      const prompt = this.createRecipePrompt(recipeParams);

      const aiResponse = await client.responses.parse({
        model: "gpt-4.1-nano",
        instructions,
        input: [
          { role: "user", content: prompt }
        ],
        temperature: 1,
        text: {
          format: zodTextFormat(GeneratedRecipesSchema, "generated_recipes_schema")
        }
      });

      const generatedRecipes = aiResponse.output_parsed?.recipes;

      if (!generatedRecipes) {
        throw new ValidationError("Сгенерированные рецепты не соответствует схеме");
      }

      const imageNames = await this.generateImages(generatedRecipes.map(({ title, description, ingredients }) => this.createImagePrompt({ title, description, ingredients })));

      await prisma.tempRecipe.createMany({
        data: generatedRecipes.map((el, i) => ({
          ...el,
          authorId,
          imageUrl: imageNames?.[i] ? `${process.env.API_URL}/uploads/${imageNames?.[i]}` : undefined
        }))
      });

      const tempRecipes = await prisma.tempRecipe.findMany({
        where: { authorId },
        orderBy: { createdAt: "desc" },
        take: 3,
      });

      return tempRecipes;
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось сгенерировать список рецептов", error));
    }
  }
  async generateImages(prompts: string[]) {
    try {
      ensureDirExists(UPLOAD_DIR);

      const results = await Promise.all(
        prompts.map(async (prompt) => {
          const result = await client.images.generate({
            model: "dall-e-2",
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
          });

          if (!result?.data?.[0]) return null;

          const base64Img = result.data[0].b64_json!;
          const buffer = Buffer.from(base64Img, "base64");
  
          const uniqueName = `${v4()}.png`;
          const filePath = path.resolve(__dirname, `./../../../${UPLOAD_DIR}`, uniqueName);
  
          await fs.promises.writeFile(filePath, buffer);
  
          return uniqueName;
        })
      );

      return results;
    } catch (error) {
      throwError(error, new AppError({ message: "Не удалось сгенерировать картинки", cause: error }));
    }
  }

  createInstructionsForRecipeGeneration() {
    return `
      Ты - профессиональный API-ассистент для генерации рецептов.
      Сгенерируй 3 креативных рецепта на основе введеннных пользовательских данных.
      Коммуникационный стиль — строгий, машинный, без эмоций.
      
      # Инструкции
      
      На основе пользовательских параметров необходимо сгенерировать 3 разных рецепта. Возможными параметрами являются: пожелания пользователя, категория блюда, сложность, кухня, время приготовления, ингредиенты.
      Если пользователь не указал ни одного параметра, то необходимо сгенерировать случайные рецепты.
      
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
      
      1. Необходимо всегда выводить только массив из 3 JSON-объектов (даже, если пользователь не указал никаких параметров, и если не получается сформировать реальный рецепт, то не писать, что невозможно сгенерировать рецепт).
      2. Все данные о рецепте генерировать на русском, кроме следующих параметров, которые имеют определенный тип вывода: category, difficulty, cuisine.
      3. Формат ответа — строго JSON-объект, который имеет только одно поле "recipes". Recipes содержит массив из 3 рецептов. Каждый рецепт имеет следующую структуру:
      
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
  createRecipePrompt({ category, difficulty, cuisine, ingredients, cookingTime, description }: GenerateRecipeParams) {
    return `
      Пожелания: ${description}
      Категория: ${category}
      Сложность: ${difficulty}
      Кухня: ${cuisine}
      Время приготовления: ${cookingTime}
      Ингредиенты: ${ingredients?.join(", ")}
    `;
  }
  createImagePrompt({ title, description, ingredients }: RecipeImagePromptProps) {
    return `
      Сгенерируй ${title}.
    `;
  }
}
