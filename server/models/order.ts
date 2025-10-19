import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
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
}, { collection: 'clients' });

export default mongoose.model('Order', OrderSchema);
