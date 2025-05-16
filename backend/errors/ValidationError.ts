import AppError, { ErrorCode, AppErrorOptions } from "./AppError";

export default class ValidationError extends AppError {
  constructor(message = "Некорректные пользовательские данные", details: AppErrorOptions["details"]) {
    super({
      message,
      code: ErrorCode.VALIDATION_ERROR,
      statusCode: 400,
      details
    })
  }
}
