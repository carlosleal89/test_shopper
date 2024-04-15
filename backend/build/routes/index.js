"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductRoute_1 = __importDefault(require("./ProductRoute"));
const router = (0, express_1.Router)();
router.use('/products', ProductRoute_1.default);
exports.default = router;
