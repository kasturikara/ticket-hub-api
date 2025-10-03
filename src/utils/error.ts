import winston from "winston";
import { Request, Response, NextFunction } from "express";

// custom format logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "ticket-hub-api" },
  transports: [
    // console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, service, stack, ...meta }) => {
            return `${timestamp} [${service}] ${level}: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta) : ""
            }${stack ? "\n" + stack : ""}`;
          }
        )
      ),
    }),
    // file transport fol all logs
    new winston.transports.File({ filename: "logs/combined.log" }),
    // separate file for error logs
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});

// use console.log for development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// error handling middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err as AppError).statusCode || 500;
  const isOperational = (err as AppError).isOperational || false;

  // log the error
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.path} - ${err.message}`, {
      error: err,
      requestId: req.headers["x-request-id"] || "unknown",
      userId: req.user?.id || "unauthenticated",
      path: req.path,
      method: req.method,
      query: req.query,
      body: process.env.NODE_ENV === "production" ? "[REDACTED]" : req.body,
    });
  } else {
    logger.warn(`${req.method} ${req.path} - ${err.message}`, {
      requestId: req.headers["x-request-id"] || "unknown",
      userId: req.user?.id || "unauthenticated",
      statusCode,
    });
  }

  // send response
  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === "development" &&
      !isOperational && { stack: err.stack }),
  });
};

// async error wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export { logger };
