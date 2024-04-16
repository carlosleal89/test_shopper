"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csvParserHelper = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, `../uploads/${filename}`);
    const results = [];
    yield new Promise((resolve, reject) => {
        fs_1.default.createReadStream(path_1.default.join(filePath))
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => {
            if (Object.keys(data).length > 0) {
                results.push(data);
            } //remove linhas em branco do csv
        })
            .on('end', () => {
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    reject(new Error('Erro ao excluir o arquivo CSV.'));
                    return;
                }
            });
            resolve(results);
        })
            .on('error', (error) => {
            reject(new Error(`Erro ao ler o arquivo CSV: ${error.message}`));
        });
    });
    return results;
});
exports.default = csvParserHelper;
