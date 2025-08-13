import { NextFunction, Request, Response } from "express";
import { userZodSchema } from "../../models/userModel";
import catchAsync from "../../utils/catchAsync";

export const validateSignup = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validatedData = userZodSchema.parse(req.body);
  req.body = validatedData;
  next();
});
