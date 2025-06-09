import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(2, "Имя должно быть не менее 2 символов"),
  email: z.string().email("Неверный формат email"),
});

export type FormData = z.infer<typeof schema>;