import type { Request, Response, NextFunction } from "express";

import "./../../../env/env";

import Service from "./authService";
import BadRequestError from "../../../errors/BadRequestError";

const service = new Service();

export default class Controller {
  constructor() {};

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequestError("Отсутствуют обязательные поля: email, password");
      }

      const userData = await service.register(email, password);

      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      res.status(200).json(userData);
    } catch(error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequestError("Отсутствуют обязательные поля: email, password");
      }

      const userData = await service.login(email, password);

      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      res.status(200).json(userData);
    } catch(error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken as string;

      const token = await service.logout(refreshToken);

      res.clearCookie("refreshToken");
      res.status(200).json(token);
    } catch(error) {
      next(error);
    }
  }
  
  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activationCode = req.params.activationCode;

      const user = await service.activate(activationCode);

      res.status(200).json(user);
    } catch(error) {
      next(error);
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken as string;

      const userData = await service.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      res.status(200).json(userData);
    } catch(error) {
      next(error);
    }
  }

  async requestEmailChange(req: Request, res: Response, next: NextFunction) {
    try {
      const { newEmail } = req.body;

      const result = await service.requestEmailChange(req.user!.id, newEmail);

      res.status(200).json(result);
    } catch(error) {
      next(error);
    }
  }
  async confirmEmailChange(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.confirmEmailChange(req.params.code);
      res.status(200).json(result);
    } catch(error) {
      next(error);
    }
  }
}