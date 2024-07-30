"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const error_1 = require("./middleware/error");
const NotFound_1 = require("./errors/NotFound");
dotenv_1.default.config({ path: `config.env` });
const app = (0, express_1.default)();
const port = +process.env.PORT || 3000;
const dburl = process.env.DATABASE_URL;
const mongosession = (0, connect_mongodb_session_1.default)(express_session_1.default);
const store = new mongosession({
    uri: dburl,
    collection: "session",
});
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use(express_1.default.json());
app.use(auth_1.default);
app.use(admin_1.default);
app.use(user_1.default);
app.use((req, res) => {
    console.log(req);
    throw new NotFound_1.NotFound("Route Not Found", 404, []);
    console.log(res);
});
app.use(error_1.errorHandler);
mongoose_1.default
    .connect(dburl)
    .then((result) => {
    console.log("Db connected...!" + result);
})
    .catch((err) => {
    console.log(err);
});
app.listen(port, () => {
    console.log("App listen 3000");
});
//# sourceMappingURL=app.js.map