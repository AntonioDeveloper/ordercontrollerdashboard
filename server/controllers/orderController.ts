'use server';

import OrderSchema from '../models/order';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllOrders = async (req: any, res: any) => {
  try {
    const allOrdersData = await OrderSchema.find().lean().exec();
    return res.status(200).json(allOrdersData ?? []);
  } catch (error) {
    return res.status(500).json({ errorMessage: String(error) });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateOrder = async (req: any, res: any) => {
  try {
    const id = req.params.id;

    // Valida o formato do ID com o Mongo DB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errorMessage: 'Invalid ID format' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ errorMessage: 'Update data is required' });
    }
    const clientId = await OrderSchema.findById(id);

    if (!clientId) {
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
      },
    );
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ errorMessage: String(error) });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrder = async (req: any, res: any) => {
  try {
    const pedidoInput = req.body?.pedido;
    const isArray = Array.isArray(pedidoInput);

    if (!pedidoInput) {
      return res.status(400).json({
        errorMessage: 'Campo "pedido" é obrigatório no corpo da requisição',
      });
    }

    const pedidoArray = isArray ? pedidoInput : [pedidoInput];

    const pedido = pedidoArray.map(
      (
        item: {
          nome_item: string;
          quantidade: number;
          preco: number;
          tamanho?: string;
          observacoes?: string;
        },
        idx: number,
      ) => {
        if (!item || typeof item !== 'object') {
          throw new Error(`Item de pedido inválido na posição ${idx}`);
        }
        const { nome_item, quantidade, preco, tamanho, observacoes } = item;
        if (nome_item == null || quantidade == null || preco == null) {
          throw new Error(
            `Item do pedido faltando campos obrigatórios (nome_item, quantidade, preco) na posição ${idx}`,
          );
        }
        return { nome_item, quantidade, preco, tamanho, observacoes };
      },
    );

    const newOrder = new OrderSchema({
      cardId: req.body.cardId,
      nome_cliente: req.body.nome_cliente,
      status_pedido: req.body.status_pedido,
      endereco: req.body.endereco,
      pedido,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    const msg = String(error);
    if (
      msg.includes('Item de pedido inválido') ||
      msg.includes('Item do pedido faltando campos obrigatórios')
    ) {
      return res.status(400).json({ errorMessage: msg });
    }
    res.status(500).json({ errorMessage: msg });
  }
};
