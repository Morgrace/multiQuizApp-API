/**
 * Custom application error class for handling operational errors
 *
 * @class AppError
 * @extends Error
 *
 * @example
 * // Client error (4xx)
 * throw new AppError("User not found", 404);
 *
 * @example
 * // Server error (5xx)
 * throw new AppError("Database connection failed", 500);
 */
export default class AppError extends Error {
  status: "fail" | "error";
  isOperational: boolean;

  /**
   * Creates an instance of AppError
   *
   * @param {string} message - The error message to display
   * @param {number} statusCode - HTTP status code (4xx results in "fail", 5xx+ results in "error")
   */
  constructor(public message: string, public statusCode: number) {
    super(message);

    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
