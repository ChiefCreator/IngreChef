import { prisma } from "../../../server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import "./../../../env/env";
import mailService from "./mailService";
import tokenService from "./tokenService";
import UserDto from "./userDto";
import DatabaseError from "../../../errors/DatabaseError";
import AppError from "../../../errors/AppError";
import { ErrorCode } from "./../../../errors/AppError"
import { throwError } from "../../lib/error";
import NotFoundError from "../../../errors/NotFoundError";
import BadRequestError from "../../../errors/BadRequestError";
import { UnauthorizedError } from "../../../errors/UnauthorizedError";
import { JwtPayload } from "jsonwebtoken";

export default class Service {
  constructor() {};

  async register(email: string, password: string) {
    try {
      const candidate = await prisma.user.findUnique({
        where: { email }
      });
    
      if (candidate) {
        throw new AppError({
          message: `Пользователь с таким email ${email} уже существует`,
          code: ErrorCode.USER_ALREADY_EXISTS_ERROR,
          statusCode: 409,
        });
      }

      const passwordHash = await bcrypt.hash(password, 3);
      const activationCode= uuidv4();
      const activationLink = `${process.env.CLIENT_URL}/auth/email-confirmation/${activationCode}`;
  
      await mailService.sendActivationMail(email, activationLink);

      const user = await prisma.user.create({ 
        data: {
          email,
          passwordHash,
          activationCode,
          profile: {
            create: {
              name: "",
            }
          }
        }
      });
  
      const userDto = new UserDto({ id: user.id, email: user.email, isActivated: user.isActivated });
      const tokens = tokenService.generateTokens({ ...userDto });
     
      await tokenService.saveToken(user.id, tokens.refreshToken);
    
      return { ...tokens, user: userDto };
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось зарегистрировать пользователя", error));
    }
  };
  async login(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      });
  
      if (!user) {
        throw new NotFoundError("Пользователь не найден", { email });
      }
  
      const isPassEquals = await bcrypt.compare(password, user.passwordHash);
  
      if (!isPassEquals) {
        throw new BadRequestError("Неверный пароль");
      }
  
      const userDto = new UserDto({ id: user.id, email: user.email, isActivated: user.isActivated });
      const tokens = tokenService.generateTokens({ ...userDto });
      
      await tokenService.saveToken(user.id, tokens.refreshToken);
      
      return { ...tokens, user: userDto };
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось авторизовать пользователя", error));
    }
  }
  async logout(refreshToken: string) {
    try {
      const token = await tokenService.deleteToken(refreshToken);
      return token;
    } catch(error) {
      throwError(error, new DatabaseError("Не удалось выйти из системы", error));
    }
  }

  async activate(activationCode: string) {
    const user = prisma.user.findUnique({
      where: { activationCode }
    });

    if (!user) {
      throw new NotFoundError("Пользователь не найден");
    }

    const updatedUser = await prisma.user.update({
      where: { activationCode },
      data: { isActivated: true }
    });

    return updatedUser;
  }
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedError("Пользователь не авторизован");
    }

    const userData = tokenService.validateRefreshToken(refreshToken) as JwtPayload;
    const tokenFromDB = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      throw new UnauthorizedError("Пользователь не авторизован");
    }

    const user = await prisma.user.findUnique({
      where: { id: userData.id }
    });

    if (!user) {
      throw new DatabaseError("Пользователь не найден");
    }

    const userDto = new UserDto({ id: user.id, email: user.email, isActivated: user.isActivated });
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(user.id, tokens.refreshToken);
  
    return { ...tokens, user: userDto };
  }

  async requestEmailChange(userId: string, newEmail: string) {
    const existing = await prisma.user.findUnique({ where: { email: newEmail } });
   
    if (existing) {
      throw new AppError({
        message: "Этот email уже занят",
        code: ErrorCode.USER_ALREADY_EXISTS_ERROR,
        statusCode: 409,
      });
    }
   
    const emailChangeCode = uuidv4();
    const link = `${process.env.CLIENT_URL}/auth/change-email-confirmation/${emailChangeCode}`;
   
    await prisma.user.update({
      where: { id: userId },
      data: {
        pendingEmail: newEmail,
        emailChangeCode,
      },
    });
   
    await mailService.sendMailChangeConfirmation(newEmail, link);
   
    return { message: "Письмо для подтверждения отправлено" };
  }
  async confirmEmailChange(code: string) {
    const user = await prisma.user.findFirst({
      where: { emailChangeCode: code },
    });

    if (!user || !user.pendingEmail) {
      throw new NotFoundError("Неверный или устаревший токен смены email");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.pendingEmail,
        pendingEmail: null,
        emailChangeCode: null,
        isActivated: true,
      },
    });

    const userDto = new UserDto({ id: updatedUser.id, email: updatedUser.email, isActivated: updatedUser.isActivated });
    const tokens = tokenService.generateTokens({ ...userDto });
     
    await tokenService.saveToken(updatedUser.id, tokens.refreshToken);
    
    return { ...tokens, user: userDto };
  }
}