"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const strong_error_handler_1 = __importDefault(require("strong-error-handler"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport_1 = __importDefault(require("passport"));
const passport_setup_1 = __importDefault(require("./config/passport-setup"));
const routes_1 = __importDefault(require("./app/routes"));
const app = express_1.default();
passport_setup_1.default();
app.use(express_1.default.json({ limit: "5mb" }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("", routes_1.default);
app.use(passport_1.default.initialize());
app.use(strong_error_handler_1.default({
    debug: process.env.ENV !== 'prod',
    log: true,
}));
exports.default = app;
//# sourceMappingURL=app.js.map