import { z } from "zod";

export const schema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов" }),
  email: z.string().email("Введен некорректный email"),
  password: z
    .string()
    .min(6, "Пароль должен содержать не менее 6 символов")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
  terms: z
    .boolean()
    .refine(val => val === true, {
      message: "Вы должны согласиться с условиями",
    }),
});

export type RegisterFormData = z.infer<typeof schema>;
