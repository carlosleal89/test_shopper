"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../uploads')); // define o local para o arquivo
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.split('.')[1];
        if (fileExtension !== 'csv') {
            return cb(new Error('Apenas arquivos CSV são permitidos'));
        }
        const newFileName = crypto_1.default.randomBytes(16).toString('hex');
        cb(null, `${newFileName}.${fileExtension}`);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
