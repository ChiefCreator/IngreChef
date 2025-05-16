import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

require("./../env/env"); 

const isDev = process.env.NODE_ENV === "development";

const logFormat = format.combine(
  format.timestamp({ format: "HH:mm:ss" }),
  format.printf(({ level, message, timestamp, ...meta }) => {
    return `[${timestamp}] [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
  })
);
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "HH:mm:ss" }),
  format.printf(({ level, message, timestamp, ...meta }) => {
    return `[${timestamp}] [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
  })
);

export const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new DailyRotateFile({
      dirname: "logger/logs",
      filename: "app_%DATE%.log",
      datePattern: "DD-MM-YYYY",
      maxFiles: "14d",
      zippedArchive: true,
    }),
    new DailyRotateFile({
      dirname: "logger/logs",
      filename: 'errors_%DATE%.log',
      level: "error",
      datePattern: "DD-MM-YYYY",
      maxFiles: "30d",
      zippedArchive: true,
    }),
  ],
});

if (isDev) {
  logger.add(
    new transports.Console({ format: consoleFormat }),
  );
}
