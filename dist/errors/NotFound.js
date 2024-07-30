"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
const custom_error_1 = require("./custom-error");
class NotFound extends custom_error_1.CustomError {
    constructor(message, errorCode, errors) {
        super(message, errorCode, errors);
    }
}
exports.NotFound = NotFound;
//# sourceMappingURL=NotFound.js.map