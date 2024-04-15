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
exports.executeSQLScript = void 0;
const index_1 = __importDefault(require("./models/index"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readSQLFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const fullPath = path.join(__dirname, filePath);
        const sqlQuery = fs_1.default.readFileSync(path_1.default.join(__dirname, filePath)).toString();
        console.log('TESTE', sqlQuery);
        return sqlQuery;
    }
    catch (error) {
        console.error('Erro ao ler o arquivo SQL');
        throw new Error(`Ocorreu um erro ao ler o arquivo SQL: ${error.message}`);
    }
});
const executeSQLScript = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = yield readSQLFile('./database.sql');
        yield index_1.default.query(sql);
        console.log('Script SQL executado com sucesso.');
    }
    catch (error) {
        console.error('Erro ao executar o script SQL:', error);
        throw new Error(`Ocorreu um erro ao executar o script SQL: ${error.message}`);
    }
});
exports.executeSQLScript = executeSQLScript;
