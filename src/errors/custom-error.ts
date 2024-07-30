export class CustomError extends Error {
  statusCode: number;
  message: string;
  error: unknown;
  constructor(message: string, statusCode: number, error: unknown) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
  }
}

export const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
