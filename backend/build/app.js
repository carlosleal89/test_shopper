"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.use(routes_1.default);
app.get('/health', (req, res) => res.status(200).json({ message: "Yeah, it's working." }));
app.use((err, req, res, next) => {
    console.log('Error middleware', err.message);
    return res.status(500).json({ message: `Internal server error: ${err.message}` });
});
exports.default = app;
