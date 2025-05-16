import AppError, { ErrorCode } from "./AppError";
import type { AppErrorOptions } from "./AppError";

export default class NotFoundError extends AppError {
  constructor(message: string, details?: AppErrorOptions["details"]) {
    super({
      message,
      code: ErrorCode.NOT_FOUND,
      statusCode: 404,
      details,
    });
  }
}
