import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema(
  {
    nome_cliente: { type: String, required: true },
    endereco: { type: String, required: true, trim: true },
    telefone: { type: String, required: true, trim: true },
  },
  { collection: 'clientsData' }
);

export default mongoose.model('Client', ClientSchema);
