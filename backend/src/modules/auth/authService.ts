import { prisma } from "../../../server";

import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserDto from "./userDto";

export default class Service {
  constructor() {};

  async register(email: string, password: string) {
    const candidate = await prisma.user.findUnique({
      where: { email }
    });
  
    if (candidate) {
      throw new Error(`Пользователь с таким email ${email} уже существует`);
    }
  
    const passwordHash = await bcrypt.hash(password, 3);
  
    const user = await prisma.user.create({ 
      data: {
        email,
        passwordHash,
      }
    });

    const userDto = new UserDto({ id: user.id, email: user.email, isActivated: user.isActivated });

    const tokens = this.generateTokens({ ...userDto });

    await this.saveToken(user.id, tokens.refreshToken);
  
    return {
      ...tokens,
      user: userDto
    };
  };

  generateTokens(payload: { id: string, email: string, isActivated: boolean }) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: "30d" });

    return { accessToken, refreshToken };
  }
  async saveToken(userId: string, refreshToken: string) {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const token = await prisma.token.upsert({
      where: { userId },
      update: {
        value: refreshToken,
        expiresAt,
      },
      create: {
        userId,
        value: refreshToken,
        expiresAt,
      },
    });

    return token;
  }
}