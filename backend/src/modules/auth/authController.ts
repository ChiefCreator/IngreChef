import type { Request, Response } from "express";

import Service from "./authService";

const service = new Service();

export default class Controller {
  constructor() {};

  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("email или пароль не были переданы");
      }

      const userData = await service.register(email, password);

      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      res.status(200).json(userData);
    } catch(error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка регистрации пользователя" });
    }
  }
}