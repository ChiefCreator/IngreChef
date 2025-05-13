import { z } from "zod";

export const createCookbookSchema = z.object({
  cookbookName: z.string()
    .min(1, { message: "Обязательное поле" })
    .max(52, { message: "Название не должно превышать 52 символа" })
});

export type LoginFormData = z.infer<typeof createCookbookSchema>;
