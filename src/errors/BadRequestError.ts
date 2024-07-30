import { CustomError } from "./custom-error";

export class BadRequests extends CustomError {
  constructor(message: string, errorCode: number, errors?: unknown) {
    super(message, errorCode, errors);
  }
}
