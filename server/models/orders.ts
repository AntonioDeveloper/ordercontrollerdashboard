import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
  },
  items: [{ type: String, required: true }],
  status: {
    type: String,
    enum: ['Recebido', 'Em Preparo', 'Saiu para Entrega', 'Entregue'],
    default: 'Recebido',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
