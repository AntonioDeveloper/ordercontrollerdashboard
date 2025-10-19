import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    nome_cliente: { type: String, required: true },
    endereco: String,
    telefone: String,
  },
  { collection: 'clientsData' }
);

export default mongoose.model('Client', ClientSchema);
