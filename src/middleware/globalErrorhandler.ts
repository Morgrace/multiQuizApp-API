import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

interface IAppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  isOperational: boolean;
  errmsg?: string;
  code?: number;
  path?: string;
  value?: string;
  keyValue?: Record<string, string>;
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

const handleDuplicateFieldsDB = (err: IAppError) => {
  let value = "";
  let field = "";

  // First, try to get the duplicate value from the keyValue object (cleanest approach)
  if (err.keyValue) {
    const duplicateField = Object.keys(err.keyValue)[0];
    field = duplicateField;
    value = err.keyValue[duplicateField];
  } else {
    // Fallback: parse the error message for the duplicate value
    // Format: dup key: { fieldName: "value" }
    const dupKeyMatch = err.errmsg?.match(
      /dup key:\s*{\s*([^:]+):\s*"([^"]+)"\s*}/
    );

    if (dupKeyMatch) {
      field = dupKeyMatch[1].trim();
      value = dupKeyMatch[2];
    } else {
      // Final fallback: try to extract any quoted value from the error message
      const quotedMatch = err.errmsg?.match(/"([^"]+)"/);
      if (quotedMatch) {
        value = quotedMatch[1];
      }
    }
  }

  // Create an informative error message
  const fieldInfo = field ? ` for field '${field}'` : "";
  const valueInfo = value ? `: '${value}'` : "";
  const message = `Duplicate field value${fieldInfo}${valueInfo}. Please use another value`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: IAppError): AppError => {
  const regex = /^[^:]+:\s*(.+)$/;
  const match = err.message.match(regex);
  const cleanMessage = match ? match[1] : err.message;
  const message = `Invalid input data. ${cleanMessage}`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err: IAppError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

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

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "CastError") error = handleCastErrorDB(error);

    sendErrorProd(error, res);
  }
}
export default globalErrorHandler;
