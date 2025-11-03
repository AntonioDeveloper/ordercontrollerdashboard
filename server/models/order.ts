import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
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
  },
  { collection: 'orders' }
);

export default mongoose.model('Order', OrderSchema);
