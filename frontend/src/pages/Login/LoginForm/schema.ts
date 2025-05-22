import { z } from "zod";

export const schema = z.object({
  email: z.string().email("Введен некорректный email"),
  password: z
    .string()
    .min(6, "Пароль должен содержать не менее 6 символов")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

export type FormData = z.infer<typeof schema>;
