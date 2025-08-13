import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import { IUser, User } from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { Request } from "express";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}
const signToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN as StringValue;

  if (!jwtSecret || !jwtExpiresIn) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

const verifyJWT = (token: string, secret: string): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded as jwt.JwtPayload);
    });
  });
};

export const signup = catchAsync(async function (req, res) {
  const newuser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = signToken(newuser._id as string);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newuser,
    },
  });
});

export const login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(new AppError("Please provide emai and password!", 400));
  }

  //validate user and user password
  const user = await User.findOne({ email }).select("+password");

  const correctPassword = await user?.correctPassword(password, user.password);

  if (!user || !correctPassword) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //sign token
  const token = signToken(user._id as string);

  res.status(200).json({
    status: "success",
    token,
  });
});

//middlewear for authorization
export const protect = catchAsync(async function (
  req: AuthenticatedRequest,
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
      new AppError("You are not logged in! Please log in to gt access.", 401)
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
  if (currentUser.changePasswordAfter(decoded.iat!)) {
    return next(
      new AppError("User recently changed password! Please log in again", 401)
    );
  }

  req.user = currentUser;
  next();
});
