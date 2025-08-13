import z, { ZodError } from "zod";
import AppError from "../appError";

export const handleZodError = (err: ZodError) => {
  const errors = err.issues.map((issue: z.core.$ZodIssue) => {
    const field = issue.path.join(".") || "unknown field";
    return `${field}: ${issue.message}`;
  });

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
