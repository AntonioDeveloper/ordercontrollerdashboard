'use server';

import OrderSchema from '../models/order';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllOrders = async (req: any, res: any) => {
  try {
    const conn = mongoose.connection;
    const dbName = conn?.db?.databaseName;
    const modelName = OrderSchema.modelName;
    const collectionName = OrderSchema.collection?.name;

    // Log de diagnóstico
    console.log('[getAllOrders] DB:', dbName);
    console.log('[getAllOrders] Model:', modelName);
    console.log('[getAllOrders] Collection:', collectionName);

    try {
      const collections = await conn.db?.listCollections().toArray();
      console.log(
        '[getAllOrders] Collections:',
        collections?.map((c) => c.name)
      );

      // Contar documentos nas coleções comuns para diagnóstico
      const ordersColCount = await conn.db
        ?.collection('orders')
        .countDocuments()
        .catch(() => -1);
      const clientsColCount = await conn.db
        ?.collection('clients')
        .countDocuments()
        .catch(() => -1);
      console.log('[getAllOrders] orders count:', ordersColCount);
      console.log('[getAllOrders] clients count:', clientsColCount);
    } catch (e) {
      console.warn('[getAllOrders] Unable to list collections:', e);
    }

    const allOrdersData = await OrderSchema.find().lean().exec();
    console.log('[getAllOrders] Count:', allOrdersData?.length ?? 0);

    // Sempre retorna 200 com array (vazio ou preenchido) para facilitar consumo no frontend
    return res.status(200).json(allOrdersData ?? []);
  } catch (error) {
    console.error('[getAllOrders] Error:', error);
    return res.status(500).json({ errorMessage: String(error) });
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
    const clientId = await OrderSchema.findById(id);
    console.log('ID:', id);
    console.log('Found client:', clientId);

    if (!clientId) {
      console.log('Client not found for ID:', id);
      return res.status(404).json({ errorMessage: 'Cliente não encontrado' });
    }
    const updatedData = await OrderSchema.findByIdAndUpdate(
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
