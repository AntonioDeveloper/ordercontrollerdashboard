'use server';

import ClientSchema from '../models/client';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllClients = async (req: any, res: any) => {
  try {
    const conn = mongoose.connection;
    const dbName = conn?.db?.databaseName;
    const modelName = ClientSchema.modelName;
    const collectionName = ClientSchema.collection?.name;

    // Log de diagnóstico
    console.log('[getAllClients] DB:', dbName);
    console.log('[getAllClients] Model:', modelName);
    console.log('[getAllClients] Collection:', collectionName);

    try {
      const collections = await conn.db?.listCollections().toArray();
      console.log(
        '[getAllClients] Collections:',
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
      console.log('[getAllClients] orders count:', ordersColCount);
      console.log('[getAllClients] clients count:', clientsColCount);
    } catch (e) {
      console.warn('[getAllClients] Unable to list collections:', e);
    }

    const allOrdersData = await ClientSchema.find().lean().exec();
    console.log('[getAllClients] Count:', allOrdersData?.length ?? 0);

    // Sempre retorna 200 com array (vazio ou preenchido) para facilitar consumo no frontend
    return res.status(200).json(allOrdersData ?? []);
  } catch (error) {
    console.error('[getAllClients] Error:', error);
    return res.status(500).json({ errorMessage: String(error) });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateClient = async (req: any, res: any) => {
  console.log('=== updateClient function invoked ===');
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
          nome_cliente: req.body.clientData.nome_cliente,
          endereco: req.body.clientData.endereco,
          telefone: req.body.clientData.telefone,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signUpClient = async (req: any, res: any) => {
  console.log('=== signUpClient function invoked ===');
  console.log('Request body:', req.body);
  console.log('Request params:', req.params);

  try {
    const newClient = new ClientSchema({
      nome_cliente: req.body.clientData.nome_cliente,
      endereco: req.body.clientData.endereco,
      telefone: req.body.clientData.telefone,
    });
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error in signUpClient:', error);
    res.status(500).json({ errorMessage: error });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loginClient = async (req: any, res: any) => {
  console.log('=== loginClient function invoked ===');
  console.log('Request body:', req.body);
  console.log('Request params:', req.params);

  const { telefone } = req.body;

  if (!telefone) {
    console.log('Telefone nulo.');
    res.status(400).json({ errorMessage: 'Telefone nulo, dado obrigatório.' });
    return;
  }

  try {
    const currentClient = await ClientSchema.findOne({
      telefone: telefone,
    });

    if (currentClient === null) {
      res.status(404).json({
        errorMessage: 'Cliente não encontrado. Favor verifique o telefone.',
      });
    } else {
      res.status(200).json(currentClient);
    }
  } catch (error) {
    console.error(
      'Telefone não fornecido ou não encontrado. Por favor, verifique:',
      error
    );
    res.status(500).json({ errorMessage: 'Erro interno do servidor.' });
  }
};
