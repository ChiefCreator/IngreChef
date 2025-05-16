import AppError, { ErrorCode, AppErrorOptions } from './AppError';

export default class DatabaseError extends AppError {
  constructor(message = "Database error", cause?: Error, details?: AppErrorOptions["details"]) {
    super({
      message,
      code: ErrorCode.DATABASE_ERROR,
      statusCode: 500,
      cause,
      details,
    });
  }
}
