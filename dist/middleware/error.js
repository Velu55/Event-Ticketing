"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_error_1 = require("../errors/custom-error");
const errorHandler = (err, req, res
// next: NextFunction
) => {
    // Handled errors
    console.log(123123123);
    if (err instanceof custom_error_1.CustomError) {
        const { statusCode, message, error } = err;
        return res.status(statusCode).json({
            message: message,
            error: error,
        });
    }
    // Unhandled errors
    //console.error(JSON.stringify(err, null, 2));
    return res
        .status(500)
        .send({ errors: [{ message: "Something went wrong" }] });
    //next(err);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map