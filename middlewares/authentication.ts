import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import catchAsyncError from "../utils/catchAsyncError";
import ErrorHandler from "../utils/errorHandlerClass";
import User from "../models/user.model";

dotenv.config();

export const isUserAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if user is logged in (check and verify access token)
    const { access_token } = req.cookies;

    // if there is no access token
    if (!access_token)
      return next(new ErrorHandler("Access Denied: Login to proceed", 403));

    // verify access token
    const decodeAccess: any = jwt.verify(
      access_token,
      (process.env.SIGN_IN_ACCESS_SECRET_KEY as string) || ""
    );

    if (!decodeAccess) return next(new ErrorHandler("Invalid token", 404));

    req.user = decodeAccess.user;
    return next();
  }
);

// check if password has been rest in the past 24 hours
export const hasPasswordChangedLast24Hours = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    // console.log(user?.dataValues);

    // check if user exists
    if (!user) return next(new ErrorHandler("Account does not exist", 404));

    // for first time
    if (user.lastPasswordReset === null) {
      req.user = user;
      return next();
    }

    const userLastResetDate: Date = new Date(user.lastPasswordReset || "");

    const presentDate: Date = new Date();

    const timeDifference = presentDate.getTime() - userLastResetDate.getTime();

    const twentFourHours = 24 * 60 * 60 * 1000; // milliseconds

    if (timeDifference > twentFourHours) {
      req.user = user;
      return next();
    } else {
      return next(
        new ErrorHandler(
          "You can only reset a password once in 24 hours. Contact support for further assistance",
          400
        )
      );
    }
  }
);
