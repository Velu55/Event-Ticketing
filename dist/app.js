"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
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
