import { NextFunction, Request, Response } from "express";
import { handleDuplicateFieldsDB } from "../utils/errors/handleDuplicateFieldDB";
import { handleValidationErrorDB } from "../utils/errors/handleValidationErrorDB";
import { handleCastErrorDB } from "../utils/errors/handleCastErrorDB";
import { ZodError } from "zod";
import { handleZodError } from "../utils/errors/handleZodError";
import { handleJWTError } from "../utils/errors/handleJWTError";
import { handleJWTExpiredError } from "../utils/errors/handleJWTExpiredError";

export interface IAppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  isOperational: boolean;
  errmsg?: string;
  code?: number;
  path?: string;
  value?: string;
  keyValue?: Record<string, string>;
  errors?: Record<
    string,
    {
      message: string;
      name: string;
      properties: {
        message: string;
        type: string;
        path: string;
      };
      kind: string;
      path: string;
      value: unknown;
    }
  >;
}
function sendErrorDev(err: IAppError, res: Response) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
}
function sendErrorProd(err: IAppError, res: Response) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
}

function globalErrorHandler(
  err: IAppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error: IAppError = {
      ...err,
      message: err.message,
      name: err.name,
      stack: err.stack,
    };

    //NOTE the main err object is being passed here
    if (err instanceof ZodError) {
      error = handleZodError(err);
    }

    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }

    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }

    if (error.name === "JsonWebTokenError") {
      handleJWTError();
    }

    if (error.name === "TokenExpiredError") {
      handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
}
export default globalErrorHandler;
