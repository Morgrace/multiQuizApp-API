import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import catchAsync from "../../utils/catchAsync";

export const validate = <T>(schema: z.ZodSchema<T>) =>
  catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  });
