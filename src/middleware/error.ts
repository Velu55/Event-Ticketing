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
      message: message,
      error: error,
    });
  }

  // Unhandled errors
  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
  console.log(next);
};
