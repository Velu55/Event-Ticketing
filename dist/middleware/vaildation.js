"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const BadRequestError_1 = require("../errors/BadRequestError");
const custom_error_1 = require("../errors/custom-error");
const validation = (req, res, next) => {
    try {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            throw new BadRequestError_1.BadRequests("Validation Error", custom_error_1.HTTP_STATUS_CODES.BAD_REQUEST, error);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = validation;
//# sourceMappingURL=vaildation.js.map