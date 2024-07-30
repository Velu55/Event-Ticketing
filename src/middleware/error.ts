import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    const { statusCode, message, error } = err;
    return res.status(statusCode).json({
      success: false,
      message: message,
      error_code: statusCode,
      data: error,
    });
  }

  // Unhandled errors
  return res.status(500).send({
    success: false,
    message: "Something went wrong",
    error_code: 500,
    data: {},
  });
  console.log(next);
};
