import AppError, { ErrorCode } from "./AppError";

export class UnauthorizedError extends AppError {
  constructor(message = "Ошибка аутентификации") {
    super({
      message,
      code: ErrorCode.AUTH_ERROR,
      statusCode: 401,
    });
  }
}
