import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  id: { type: String, required: true },
  cardId: { type: String, required: true },
  nome_cliente: { type: String, required: true },
  status_pedido: { type: String, required: true },
  endereco: String,
  pedido: {
    pizza_sabor: String,
    tamanho: String,
    quantidade: Number,
    observacoes: String,
  },
});

export default mongoose.model('Client', ClientSchema);
