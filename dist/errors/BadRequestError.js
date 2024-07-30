"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequests = void 0;
const custom_error_1 = require("./custom-error");
class BadRequests extends custom_error_1.CustomError {
    constructor(message, errorCode, errors) {
        super(message, errorCode, errors);
    }
}
exports.BadRequests = BadRequests;
//# sourceMappingURL=BadRequestError.js.map