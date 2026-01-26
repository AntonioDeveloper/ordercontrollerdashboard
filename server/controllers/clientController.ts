'use server';

import ClientSchema from '../models/client';
import mongoose from 'mongoose';

const normalizePhone = (value: string) => value.replace(/\D/g, '');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllClients = async (req: any, res: any) => {
  try {
    const allOrdersData = await ClientSchema.find().lean().exec();
    return res.status(200).json(allOrdersData ?? []);
  } catch (error) {
    return res.status(500).json({ errorMessage: String(error) });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getOneClient = async (req: any, res: any) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ errorMessage: 'Missing data query' });
    }

    const name = req.body.query;

    const foundClient = await ClientSchema.findOne({
      nome_cliente: name,
    }).exec();

    return res.status(200).json(foundClient ?? []);
  } catch (error) {
    console.error('Error data query:', error);
    res.status(500).json({ errorMessage: String(error) });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateClient = async (req: any, res: any) => {
  try {
    const id = req.params.id;

    // Valida o formato do ID com o Mongo DB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errorMessage: 'Invalid ID format' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ errorMessage: 'Update data is required' });
    }
    const clientId = await ClientSchema.findById(id);

    if (!clientId) {
      return res.status(404).json({ errorMessage: 'Client not found' });
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
      },
    );
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ errorMessage: String(error) });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signUpClient = async (req: any, res: any) => {
  try {
    const body = req.body?.clientData;
    if (!body || !body.nome_cliente || !body.endereco || !body.telefone) {
      return res.status(400).json({
        errorMessage: 'Campos obrigatórios: nome_cliente, endereco, telefone.',
      });
    }
    const normalizedPhone = normalizePhone(String(body.telefone));
    if (!normalizedPhone) {
      return res.status(400).json({
        errorMessage: 'Telefone inválido.',
      });
    }
    const newClient = new ClientSchema({
      nome_cliente: body.nome_cliente,
      endereco: body.endereco,
      telefone: normalizedPhone,
    });
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    const msg = String((error as Error)?.message ?? error);
    const code = (error as { code?: number })?.code;
    if (code === 11000 || msg.includes('duplicate key')) {
      return res.status(409).json({ errorMessage: 'Telefone já cadastrado.' });
    }
    res.status(500).json({ errorMessage: msg });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loginClient = async (req: any, res: any) => {
  const { telefone } = req.body;

  if (!telefone) {
    res.status(400).json({ errorMessage: 'Telefone nulo, dado obrigatório.' });
    return;
  }

  try {
    const normalizedPhone = normalizePhone(String(telefone));
    if (!normalizedPhone) {
      return res.status(400).json({
        errorMessage: 'Telefone inválido.',
      });
    }

    const allClients = await ClientSchema.find().lean().exec();
    const currentClient = allClients.find((client: { telefone?: string }) => {
      if (!client.telefone) return false;
      return normalizePhone(String(client.telefone)) === normalizedPhone;
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
      error,
    );
    res.status(500).json({ errorMessage: 'Erro interno do servidor.' });
  }
};
