import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import catchAsyncError from "../utils/catchAsyncError";
import ErrorHandler from "../utils/errorHandlerClass";
import { accessTokenOptions, refreshTokenOptions } from "../utils/tokens";

dotenv.config();

export const updateToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // fetch the refrsh token from the request cookies
    const { refresh_token } = req.cookies;

    if (!refresh_token)
      return next(new ErrorHandler("Session has expired: Kindly log in.", 408));

    // verify if token is valid
    const decode = jwt.verify(
      refresh_token,
      process.env.SIGN_IN_REFRESH_SECRET_KEY as string
    ) as { user: any };

    // NOTE: jwt will return an error if refresh_token has expired. No need to check (It is handle in the middleware)

    const user = decode.user;

    // generate a new access and refresh tokens
    const accessToken = jwt.sign(
      { user },
      process.env.SIGN_IN_ACCESS_SECRET_KEY as string,
      {
        expiresIn:
          `${Number(process.env.ACCESS_TOKEN_EXPIRATION) as any}d` || "1d",
      }
    );

    const refreshToken = jwt.sign(
      { user },
      process.env.SIGN_IN_REFRESH_SECRET_KEY as string,
      {
        expiresIn:
          `${Number(process.env.REFRESH_TOKEN_EXPIRATION) as any}d` || "5d",
      }
    );

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    req.user = user;
    next();
  }
);
