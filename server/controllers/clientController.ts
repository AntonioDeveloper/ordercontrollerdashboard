'use server';

import ClientSchema from '../models/clients';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllClients = async (req: any, res: any) => {
  try {
    const allClientsData = await ClientSchema.find();

    if (!allClientsData || allClientsData.length === 0) {
      return res.status(400).json({ message: 'Nenhum cliente encontrado' });
    }

    res.status(200).json(allClientsData);
  } catch (error) {
    res.status(500).json({ errorMessage: error });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateOrder = async (req: any, res: any) => {
  console.log('=== updateOrder function invoked ===');
  console.log('Request body:', req.body);
  console.log('Request params:', req.params);

  try {
    const id = req.params.id;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errorMessage: 'Invalid ID format' });
    }
    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ errorMessage: 'Update data is required' });
    }
    const clientId = await ClientSchema.findById(id);
    console.log('ID:', id);
    console.log('Found client:', clientId);

    if (!clientId) {
      console.log('Client not found for ID:', id);
      return res.status(404).json({ errorMessage: 'Cliente não encontrado' });
    }
    const updatedData = await ClientSchema.findByIdAndUpdate(
      id,
      {
        $set: {
          status_pedido: req.body.status_pedido,
        },
      },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    );
    console.log('UpdatedData', updatedData);
    res.status(200).json(updatedData);
  } catch (error) {
    console.error('Error in updateOrder:', error);
    res.status(500).json({ errorMessage: error });
  }
};
