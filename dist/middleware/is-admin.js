"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.role) == "admin") {
        next();
    }
    else {
        return res.status(401).json({
            error: "Unauthenticated User...!",
        });
    }
};
exports.default = isAdmin;
