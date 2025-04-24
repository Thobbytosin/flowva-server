import { Router } from "express";
import {
  forgotPassword,
  getUserData,
  updateUserPreferences,
} from "../controllers/user.controller";
import {
  hasPasswordChangedLast24Hours,
  isUserAuthenticated,
} from "../middlewares/authentication";

const userRouter = Router();

// FORGOT PASSWORD
userRouter.post(
  "/forgot-password",
  hasPasswordChangedLast24Hours,
  forgotPassword
);

// GET USER DETAILS
userRouter.get("/me", isUserAuthenticated, getUserData);

// UPDATE USER PREFERENCE
userRouter.put(
  "/update-user-preference",
  isUserAuthenticated,
  updateUserPreferences
);

export default userRouter;
