import { prisma } from "../../../server";
import jwt from "jsonwebtoken";
import "./../../../env/env";

class TokenService {
  constructor() {};

  generateTokens(payload: { id: string, email: string, isActivated: boolean }) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "30d" });

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
  async deleteToken(refreshToken: string) {
    const token = await prisma.token.delete({
      where: {
        value: refreshToken,
      }
    })
    
    return token;
  }
  async findToken(refreshToken: string) {
    const token = await prisma.token.findUnique({
      where: {
        value: refreshToken,
      }
    })
 
    return token;
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
      return userData;
    } catch(error) {
      return null;
    }
  }
  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
      return userData;
    } catch(error) {
      return null;
    }
  }
}

export default new TokenService();