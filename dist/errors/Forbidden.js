"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forbidden = void 0;
const custom_error_1 = require("./custom-error");
class Forbidden extends custom_error_1.CustomError {
    constructor(message, errorCode, errors) {
        super(message, errorCode, errors);
    }
}
exports.Forbidden = Forbidden;
//# sourceMappingURL=Forbidden.js.map