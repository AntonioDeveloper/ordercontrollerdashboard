"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    cardId: { type: String, required: true },
    nome_cliente: { type: String, required: true },
    status_pedido: { type: String, required: true },
    endereco: String,
    pedido: [
        {
            nome_item: { type: String, required: true },
            tamanho: String,
            quantidade: { type: Number, required: true },
            observacoes: String,
            preco: { type: Number, required: true },
        },
    ],
}, { collection: 'orders' });
exports.default = mongoose_1.default.model('Order', OrderSchema);
