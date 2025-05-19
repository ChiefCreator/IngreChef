import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

import tokenService from "../modules/auth/tokenService";
import UserDto from "../modules/auth/userDto";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError("Пользователь не авторизован");
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      throw new UnauthorizedError("Пользователь не авторизован");
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      throw new UnauthorizedError("Пользователь не авторизован");
    }

    req.user = userData as UserDto;
    next();
  } catch(error) {
    next(new UnauthorizedError("Пользователь не авторизован"));
  }
}