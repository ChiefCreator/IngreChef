import { Request, Response, NextFunction } from "express";

import { logger } from "../../logger";

import AppError from "../../errors/AppError";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let customError: AppError;

  const isErrInstanceOfAppError = err instanceof AppError;
  const isErrInstanceOfError = err instanceof Error;

  if (isErrInstanceOfAppError) {
    customError = err;
  } else {
    customError = new AppError({
      message: isErrInstanceOfError ? err.message : "Неизвестная ошибка",
      cause: isErrInstanceOfError ? err : undefined,
    });
  }

  logger.error(`${customError.code} - ${customError.message}`, {
    path: req.path,
    method: req.method,
    statusCode: customError.statusCode,
    details: customError.details,
    stack: customError.stack,
    cause: customError.cause,
  });

  res.status(customError.statusCode).json(customError.toJSON());
};