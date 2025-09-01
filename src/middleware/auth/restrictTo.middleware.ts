import { IAuthenticatedRequest } from "../../controllers/authController";
import { IUser } from "../../models/userModel";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";

export const restrictTo = (...roles: Array<IUser["role"]>) => {
  return catchAsync(async function (req: IAuthenticatedRequest, res, next) {
    if (!req.user) {
      return next(
        new AppError("You must be logged in to access this resource", 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  });
};
