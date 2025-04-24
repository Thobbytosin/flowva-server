import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { sendMail } from "../utils/sendMail";
import catchAsyncError from "../utils/catchAsyncError";
import ErrorHandler from "../utils/errorHandlerClass";
import User, { IUserPreferences } from "../models/user.model";

dotenv.config();

// //////////////////////////////////////////////////////////////////////////////////////////////// FORGOT PASSWORD
export const forgotPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) return next(new ErrorHandler("Field is required", 403));

    const isUserExists = await User.findOne({ email });

    if (!isUserExists)
      return next(new ErrorHandler("Account does not exist", 404));

    const resetPassword = process.env.RESET_PASSWORD || "";

    const mailData = { password: resetPassword };

    try {
      await sendMail({
        subject: "Password Reset",
        email: isUserExists.email,
        templateName: "reset-password-email.ejs",
        templateData: mailData,
      });

      res.status(200).json({
        success: true,
        message: "Password reset instructions has been sent to your email.",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// //////////////////////////////////////////////////////////////////////////////////////////////// GET USER DATA
export const getUserData = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    const user = await User.findById(loggedInUser._id);

    if (!user) return next(new ErrorHandler("Account not found", 404));

    res.status(200).json({ success: true, user });
  }
);

// //////////////////////////////////////////////////////////////////////////////////////////////// GET USER DATA
export const updateUserPreferences = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      selfDescription,
      work,
      country,
      toolStack,
      goals,
    }: IUserPreferences = req.body;

    const loggedInUser = req.user;

    const user = await User.findById(loggedInUser._id);

    if (!user) return next(new ErrorHandler("Account not found", 404));

    user.prefernces = { selfDescription, work, country, toolStack, goals };

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Your preferences has been updated" });
  }
);
