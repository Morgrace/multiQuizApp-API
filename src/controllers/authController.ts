import { Request } from "express";
import crypto from "node:crypto";
import { IUser, User } from "../models/userModel";
import { createSendToken } from "../utils/JWTHelper";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { sendEmail } from "../utils/email";

export interface IAuthenticatedRequest extends Request {
  user?: IUser;
}

export const signup = catchAsync(async function (req, res) {
  const newuser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  createSendToken(newuser, 201, res);
});

export const login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  //validate user and user password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const correctPassword = await user.correctPassword(password, user.password);
  if (!correctPassword) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  //Get user
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }

  //Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \nIf you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10mins)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email, Try again later!",
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    if (!req.user) {
      return next(
        new AppError("You must be logged in to perform this action", 401)
      );
    }

    //Get user from collection
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return next(new AppError("User does not exist! Please Signup!", 404));
    }

    //Check if POSTed current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("Your current password is wrong", 401));
    }

    //update password
    user.password = req.body.password;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await user.save();

    //Log user in, send JWT
    createSendToken(user, 200, res);
  }
);
