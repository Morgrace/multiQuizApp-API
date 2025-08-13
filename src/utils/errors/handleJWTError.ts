import AppError from "../appError";

export const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);
