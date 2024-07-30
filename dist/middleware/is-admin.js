"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Unauthendicate_1 = require("../errors/Unauthendicate");
const custom_error_1 = require("../errors/custom-error");
const isAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.role) == "admin") {
        next();
    }
    else {
        throw new Unauthendicate_1.Unauth("Unauthendicate User..!", custom_error_1.HTTP_STATUS_CODES.UNAUTHORIZED, []);
    }
};
exports.default = isAdmin;
//# sourceMappingURL=is-admin.js.map