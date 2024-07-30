"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS_CODES = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode, error) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
    }
}
exports.CustomError = CustomError;
exports.HTTP_STATUS_CODES = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
//# sourceMappingURL=custom-error.js.map