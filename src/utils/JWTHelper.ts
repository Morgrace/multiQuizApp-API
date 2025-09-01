import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import { IUser } from "../models/userModel";
import { Response } from "express";

interface ICookieOptions {
  maxAge: number;
  httpOnly: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  domain?: string;
}

export const signToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN as StringValue;

  if (!jwtSecret || !jwtExpiresIn) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

export const verifyJWT = (
  token: string,
  secret: string
): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded as jwt.JwtPayload);
    });
  });
};

export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  if (!process.env.JWT_EXPIRES_IN) {
    throw new Error("Missing JWT Expires environment variable");
  }
  const token = signToken(user._id as string);

  const cookieOptions: ICookieOptions = {
    maxAge: Number.parseFloat(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
