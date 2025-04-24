import { Router } from "express";
import {
  googleLogin,
  loginUser,
  registerUser,
} from "../controllers/auth.controller";

const authRouter = Router();

// SIGN UP
authRouter.post("/signup", registerUser);

// LOGIN
authRouter.post("/signin", loginUser);

// LOGIN(GOOGLE)
authRouter.post("/google-signin", googleLogin);

export default authRouter;
