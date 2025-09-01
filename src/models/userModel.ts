import bcrypt from "bcrypt";
import mongoose, { Document, Query } from "mongoose";
import crypto from "node:crypto";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  photo?: string;
  role: "user" | "premium" | "admin";
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  closedAccount?: Date;
  active: boolean;

  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
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
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "premium", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photo: String,
  passwordChangedAt: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  closedAccount: { type: Date, select: false },
});

userSchema.virtual("MultiOptionQuestion", {
  ref: "MultiOption",
  foreignField: "createdBy",
  localField: "_id",
});

//pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre(/^find/, function (this: Query<IUser[], IUser>, next) {
  const opts = this.getOptions() as { includeInactive?: boolean };
  if (opts.includeInactive) return next();
  this.find({ active: { $ne: false } });
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

userSchema.methods.changedPasswordAfter = function (
  this: IUser,
  JWTTimestamp: number
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );
    return changedTimestamp > JWTTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function (this: IUser) {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); //10mins

  return resetToken; // Return the unencrypted token
};

export const User = mongoose.model<IUser>("User", userSchema);
