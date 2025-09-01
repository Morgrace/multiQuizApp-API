import { IAuthenticatedRequest } from "../../controllers/authController";
import { User } from "../../models/userModel";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import { verifyJWT } from "../../utils/JWTHelper";

export const protect = catchAsync(async function (
  req: IAuthenticatedRequest,
  res,
  next
) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  //validate token
  const decoded = await verifyJWT(token, process.env.JWT_SECRET!);

  //validate user
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  //Check if user changed password after token was issued;
  if (currentUser.changedPasswordAfter(decoded.iat!)) {
    return next(
      new AppError("User recently changed password! Please log in again", 401)
    );
  }

  req.user = currentUser;
  next();
});
