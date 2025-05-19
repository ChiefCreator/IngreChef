import AppError, { ErrorCode, AppErrorOptions } from './AppError';

export default class BadRequestError extends AppError {
  constructor(message = "Неверный запрос", details?: AppErrorOptions["details"]) {
    super({
      message,
      code: ErrorCode.BAD_REQUEST,
      statusCode: 400,
      details,
    });
  }
}
