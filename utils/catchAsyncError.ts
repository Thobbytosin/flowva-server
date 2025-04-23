import { Request, Response, NextFunction } from "express";

const catchAsyncError =
  (func: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };

export default catchAsyncError;

// FOR CLARITY
// const catchAsyncError = (func: any) => {
//   return () => {
//     // The inner function will execute here
//   };
// };
