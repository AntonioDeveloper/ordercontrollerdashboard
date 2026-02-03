"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ClientSchema = new mongoose_1.default.Schema({
    nome_cliente: { type: String, required: true },
    endereco: { type: String, required: true, trim: true },
    telefone: { type: String, required: true, trim: true, unique: true },
}, { collection: 'clientsData' });
exports.default = mongoose_1.default.model('Client', ClientSchema);
