import { IAppError } from "../../middleware/globalErrorhandler";
import AppError from "../appError";

export const handleValidationErrorDB = (err: IAppError): AppError => {
  //   const regex = /^[^:]+:\s*(.+)$/;
  //   const match = err.message.match(regex);
  //   const cleanMessage = match ? match[1] : err.message;
  //   const message = `Invalid input data. ${cleanMessage}`;
  const errors = Object.values(err.errors!).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
