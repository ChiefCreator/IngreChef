import { z } from 'zod';

const genderSchema = z.enum(["male", "female", "unspecified"]).optional();

const cookingLevelSchema = z.enum(["novice", "intermediate", "expert"]).optional();

export const schema = z.object({
  gender: genderSchema,
  age: z
    .number({
      required_error: "Возраст обязателен",
      invalid_type_error: "Возраст должен быть числом",
    })
    .int("Возраст должен быть целым числом")
    .min(0, { message: "Возраст не может быть меньше 0" })
    .max(120, { message: "Возраст не может быть больше 120" })
    .optional(),
  weight: z
    .number({
      required_error: "Вес обязателен",
      invalid_type_error: "Вес должен быть числом",
    })
    .min(0, { message: "Вес не может быть меньше 0" })
    .optional(),
  
  height: z
    .number({
      required_error: "Рост обязателен",
      invalid_type_error: "Рост должен быть числом",
    })
    .min(0, { message: "Рост не может быть меньше 0" })
    .optional(),
  cookingLevel: cookingLevelSchema,
  allergies: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
});


export type FormData = z.infer<typeof schema>;