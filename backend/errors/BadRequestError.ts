import AppError, { ErrorCode } from './AppError';

export class BadRequestError extends AppError {
  constructor(message = "Неверный запрос", details?: Record<string, unknown>) {
    super({
      message,
      code: ErrorCode.BAD_REQUEST,
      statusCode: 400,
      details,
    });
  }
}
