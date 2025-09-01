import { NextFunction, Response } from "express";
import { IAuthenticatedRequest } from "../../controllers/authController";

export const getMe = (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  req.params.id = req.user!.id;
  next();
};
