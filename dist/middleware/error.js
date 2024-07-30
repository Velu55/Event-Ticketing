"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_error_1 = require("../errors/custom-error");
const errorHandler = (err, req, res, next) => {
    if (err instanceof custom_error_1.CustomError) {
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
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map