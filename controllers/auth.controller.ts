import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import catchAsyncError from "../utils/catchAsyncError";
import ErrorHandler from "../utils/errorHandlerClass";
import User, { IRegistration } from "../models/user.model";
import { isEmailValid, isPasswordStrong } from "../utils/helpers";
import sendMail from "../utils/sendMail";
import { signInWithCredentials } from "../services/auth.service";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

// google client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//////////////////////////////////////////////////////////////////////////////////////////////// USER REGISTRATION
export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: IRegistration = req.body;

    if (!email || !password || email.trim() === "" || password.trim() === "") {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      return next(new ErrorHandler("Account already exists", 409));
    }

    if (!isEmailValid.test(email)) {
      return next(new ErrorHandler("Please enter a valid email", 400));
    }

    if (!isPasswordStrong(password)) {
      return next(new ErrorHandler("Password security is too weak", 400));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      verified: true,
    });

    if (!newUser) {
      return next(
        new ErrorHandler("Error creating your account. Please try again", 400)
      );
    }

    // try-catch block for the email
    try {
      // send mail
      await sendMail({
        email: newUser.email,
        subject: "Welcome Message",
        templateName: "welcome-email.ejs",
      });

      res.status(200).json({
        success: true,
        message: "Account created successful! You can proceed to sign in.",
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler("Mail sending Failed", 400));
    }
  }
);

// //////////////////////////////////////////////////////////////////////////////////////////////// SIGN IN USER
export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password || email.trim() === "" || password.trim() === "")
      return next(new ErrorHandler("All fields are required", 403));

    // check if user exists
    const user = await User.findOne({ email }).select("+password"); // include password

    if (!user) return next(new ErrorHandler("Account not found", 404));

    const resetPassword = process.env.RESET_PASSWORD;

    if (password !== resetPassword) {
      // check if password matches
      const isPasswordMatch = bcryptjs.compareSync(
        password,
        user.password || ""
      );

      if (!isPasswordMatch)
        return next(new ErrorHandler("Invalid credentials", 404));
    }

    // set the user last login
    user.lastLogin = new Date();
    await user.save();

    // remove the password when sending user details to the client
    const newUser = await User.findOne({ email });

    // sign in user
    if (newUser) {
      signInWithCredentials(newUser, 200, req, res, next);
    } else {
      return next(new ErrorHandler("Error signing in", 408));
    }
  }
);

// //////////////////////////////////////////////////////////////////////////////////////////////// SIGN IN USER (GOOGLE)
export const googleLogin = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }
    const access_token = authHeader.split(" ")[1]; // Extract token

    // Validate token
    // const tokenInfo = await client.getTokenInfo(access_token);

    //  Fetch full user profile (name, picture, etc.)
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const data = await response.json();

    // check if user exists
    const user = await User.findOne({ email: data.email });

    if (user) {
      signInWithCredentials(user, 200, req, res, next); // sign in user
    } else {
      // create the user
      const password = Math.random().toString(36).slice(-10); // generate random password
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const newUser = await User.create({
        email: data.email,
        password: hashedPassword,
        verified: true,
        googleRegistered: true,
      });

      if (!newUser)
        return next(new ErrorHandler("Error logging. Server error", 501));

      //  to avoid sending the password
      const updatedUser = await User.findOne({ email: newUser.email });

      if (updatedUser) {
        // sign in user
        signInWithCredentials(updatedUser, 200, req, res, next);
      }
    }
  }
);
