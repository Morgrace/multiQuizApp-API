import AppError from "../appError";

export const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again", 401);
