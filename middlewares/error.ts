import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandlerClass";

const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("ERROR MESSAGE:", err.message);

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  err.name = err.name || "Server Error";

  if (err.name === "TokenExpiredError" || err.message === "jwt expired") {
    const message = "Session has ended. Kindly Login to access this resource.";
    err = new ErrorHandler(message, 400);
  }

  if (err.message === "invalid signature") {
    const message = "Invalid Token.";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({ success: false, message: err.message });
};

export default ErrorMiddleware;
