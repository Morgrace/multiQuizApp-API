import { Request, Response } from "express";
import { IUser, User } from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { deleteOne, getAll, getOne, updateOne } from "../utils/handlerFactory";
import { IAuthenticatedRequest } from "./authController";

export const updateMe = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    //create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword",
          400
        )
      );
    }

    // 2) Filter only allowed fields (avoid updating undefined values)
    const allowedFieldsToUpdate: Partial<
      Pick<IUser, "name" | "email" | "photo">
    > = {};

    if (req.body.name !== undefined) allowedFieldsToUpdate.name = req.body.name;
    if (req.body.email !== undefined)
      allowedFieldsToUpdate.email = req.body.email;
    if (req.body.photo !== undefined)
      allowedFieldsToUpdate.photo = req.body.photo;

    // 3) Check if there are actually fields to update
    if (Object.keys(allowedFieldsToUpdate).length === 0) {
      return next(new AppError("No valid fields provided for update", 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user!.id,
      allowedFieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const deleteMe = catchAsync(async (req: IAuthenticatedRequest, res) => {
  await User.findByIdAndUpdate(req.user!.id, {
    active: false,
    closedAccount: Date.now(),
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

export const getAllUsers = getAll(User);
export const getUser = getOne(User);

//Do noe update passwords with this;
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
