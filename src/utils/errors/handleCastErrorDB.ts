import { IAppError } from "../../middleware/globalErrorhandler";
import AppError from "../appError";

export const handleCastErrorDB = (err: IAppError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};