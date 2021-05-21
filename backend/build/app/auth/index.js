"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../../config/config"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.post("/login", (req, res) => {
    res.send(config_1.default);
});
router.get("/google", passport_1.default.authenticate('google', {
    session: false,
    scope: ["profile", "email"],
    accessType: "offline"
}));
router.get("/google/callback", passport_1.default.authenticate('google', { session: false }), (req, res) => {
    res.send("thanks for login");
});
router.get("/failed", (req, res) => {
    res.send("login failed");
});
exports.default = router;
//# sourceMappingURL=index.js.map