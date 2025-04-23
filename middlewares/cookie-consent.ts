import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import ErrorHandler from "../utils/errorHandlerClass";
export interface CookieConsentType {
  necessary: boolean;
  advertising: boolean;
  tracking: boolean;
}

export const checkCookieConsent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const rawConsent = req.headers["x-cookie-consent"];

    if (!rawConsent)
      return next(
        new ErrorHandler("Cookie consent is required to proceed", 404)
      );

    const consentHeader = Array.isArray(rawConsent)
      ? rawConsent[0]
      : rawConsent;

    let consent = {} as CookieConsentType;

    try {
      consent = JSON.parse(consentHeader);
    } catch (error) {
      return next(new ErrorHandler("Invalid cookie consent format", 400));
    }

    next();
  }
);
