import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  status_order: { type: String, required: true },
  address: String,
  order: {
    pizza_flavour: String,
    size: String,
    quantity: Number,
    observations: String,
  },
});

export default mongoose.model('Client', ClientSchema);
