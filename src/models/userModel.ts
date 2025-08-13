import mongoose, { Document } from "mongoose";
import { z } from "zod";
import bcrypt from "bcrypt";

export const userZodSchema = z
  .object({
    name: z.string().min(2, "Name is required").max(50),
    email: z.email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(30),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password don't match",
    path: ["passwordConfirm"],
  });

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  photo?: string;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changePasswordAfter(JWTTimestamp: number): boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordChangedAt: Date,
  photo: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//deletes password always so it never appears on the response
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changeTimestamp =
      parseInt(this.passwordChangedAt.getTime(), 10) / 1000;
    //   NOTE remember to invert this to experiment;
    return JWTTimestamp < changeTimestamp;
  }
  return false;
};

export const User = mongoose.model<IUser>("User", userSchema);
