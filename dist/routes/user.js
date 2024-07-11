"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../controller/user"));
const router = (0, express_1.Router)();
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
router.post("/getall-event", is_auth_1.default, user_1.default.getAllEvent);
router.get("/get-event/:id", is_auth_1.default, user_1.default.getEvent);
exports.default = router;
