import { Router } from "express";
import {
  accountVerification,
  loginUser,
  refreshToken,
  registerUser,
  resendVerificationCode,
} from "../controllers/auth.controller";
import { updateToken } from "../middlewares/updateToken";

const authRouter = Router();

// SIGN UP
authRouter.post("/signup", registerUser);

// ACCOUNT VERIFICATION
authRouter.post("/account-verification", accountVerification);

// RESEND VERIFICATION CODE
authRouter.post("/resend-verification-code", resendVerificationCode);

// LOGIN
authRouter.post("/login", loginUser);

// REFRESH TOKEN
authRouter.get("/refresh-tokens", updateToken, refreshToken);

export default authRouter;
