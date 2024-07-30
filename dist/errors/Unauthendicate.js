"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauth = void 0;
const custom_error_1 = require("./custom-error");
class Unauth extends custom_error_1.CustomError {
    constructor(message, errorCode, errors) {
        super(message, errorCode, errors);
    }
}
exports.Unauth = Unauth;
//# sourceMappingURL=Unauthendicate.js.map