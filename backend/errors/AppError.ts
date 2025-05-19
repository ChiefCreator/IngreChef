export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  AUTH_ERROR = "AUTH_ERROR",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  USER_ALREADY_EXISTS_ERROR = "USER_ALREADY_EXISTS_ERROR"
}

export interface AppErrorOptions {
  message: string;
  code?: ErrorCode;
  statusCode?: number;
  cause?: unknown;
  details?: Record<string, unknown>;
}

export default class AppError extends Error {
  readonly code: AppErrorOptions["code"];
  readonly statusCode: AppErrorOptions["statusCode"];
  readonly details?: AppErrorOptions["details"];
  cause?: AppErrorOptions["cause"];
  stack?: string;

  constructor({ message, code = ErrorCode.INTERNAL_ERROR, statusCode = 500, details, cause }: AppErrorOptions) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.cause = cause;

    if (cause && cause instanceof Error && cause?.stack) {
      this.stack = cause.stack;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}