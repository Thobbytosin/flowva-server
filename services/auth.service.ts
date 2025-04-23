import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { accessTokenOptions, refreshTokenOptions } from "../utils/tokens";

dotenv.config();

export const signInWithCredentials = async (
  user: IUser,
  statusCode: number,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // generate unique access token when user logs in
  const accessToken = jwt.sign(
    { user },
    process.env.SIGN_IN_ACCESS_SECRET_KEY as string,
    { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION as any}d` || "1d" }
  );

  //   generate unique refresh token when user logs in
  const refreshToken = jwt.sign(
    { user },
    process.env.SIGN_IN_REFRESH_SECRET_KEY as string,
    { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRATION as any}d` || "5d" }
  );

  //   save tokens in the response cookie
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  // send response to the client
  res.status(statusCode).json({
    success: true,
    message: "Signed in successfully",
    user,
  });
};
