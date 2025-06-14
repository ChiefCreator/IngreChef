import AppError from "../../errors/AppError";

export function throwError(error: unknown, appError: AppError): never {
  if (error instanceof AppError) {
    throw error;
  }

  throw appError;
}