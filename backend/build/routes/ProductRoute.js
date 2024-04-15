"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductController_1 = __importDefault(require("../controllers/ProductController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
const productController = new ProductController_1.default();
router.get('/', (req, res) => productController.getAllProducts(req, res));
exports.default = router;
