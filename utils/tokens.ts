import dotenv from "dotenv";

interface ITokenOptions {
  maxAge: number;
  httpOnly: boolean;
  sameSite: "none" | "lax" | "strict";
  secure?: boolean;
}

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// create the tokens expiration time
const accessTokenExpiration: any =
  Number(process.env.ACCESS_TOKEN_EXPIRATION) || 1;

const refreshTokenExpiration: any =
  Number(process.env.REFRESH_TOKEN_EXPIRATION) || 5;

// access token cookies options
export const accessTokenOptions: ITokenOptions = {
  maxAge: accessTokenExpiration * 24 * 60 * 60 * 1000, //1 day
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

// refresh token cookies options
export const refreshTokenOptions: ITokenOptions = {
  maxAge: refreshTokenExpiration * 24 * 60 * 60 * 1000, //5 days
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

// verification token cookies options
export const verificationTokenOptions: ITokenOptions = {
  maxAge: 5 * 60 * 1000, // 5 miuntes
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

// reset token cookies options
export const resetTokenOptions: ITokenOptions = {
  maxAge: 5 * 60 * 1000, // 5 miuntes
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};
