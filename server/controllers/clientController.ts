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
  try {
    const id = req.params.id;
    const clientId = await ClientSchema.findById(id);
    console.log('ID', id, 'clientId', clientId);
    console.log('É válido?', mongoose.Types.ObjectId.isValid(req.params.id));
    if (!clientId) {
      return res.status(404).json({ errorMessage: 'Cliente não encontrado' });
    }

    const updatedData = await ClientSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error });
  }
};
