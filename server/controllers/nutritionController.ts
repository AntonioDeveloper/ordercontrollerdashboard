'use server';

import mongoose from 'mongoose';
import MenuSchema from '../models/menu';
import { analyzeLocally } from '../services/nutritionLocal';
import { analyzeWithAI } from '../services/nutritionAI';

type CartItem = {
  nome_item: string;
  quantidade: number;
  tamanho?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const analyzeNutrition = async (req: any, res: any) => {
  try {
    // Diagnóstico: logar headers e body recebidos
    console.log('[analyzeNutrition] req.method:', req?.method, 'req.url:', req?.url);
    console.log('[analyzeNutrition] headers.content-type:', req?.headers?.['content-type']);
    console.log('[analyzeNutrition] raw body:', req?.body);

    const cartItems: CartItem[] | undefined = req.body?.cartItems;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res
        .status(400)
        .json({ errorMessage: 'Campo "cartItems" é obrigatório (array com itens do carrinho).' });
    }

    // Obter menu para estimativas de calorias
    const conn = mongoose.connection;
    const dbName = conn?.db?.databaseName;
    console.log('[analyzeNutrition] DB:', dbName);

    const menuDoc = await MenuSchema.findOne().lean().exec();
    if (!menuDoc) {
      console.warn('[analyzeNutrition] Menu não encontrado, usando estimativas padrão.');
    }

    const engine = process.env.NUTRITION_ENGINE ?? 'local';
    if (engine === 'ai') {
      const localResult = analyzeLocally(cartItems, menuDoc);
      try {
        const aiResult = await analyzeWithAI(cartItems, {
          totalCalorias: localResult.totalCalorias,
          porItem: localResult.porItem,
        });
        return res.status(200).json(aiResult);
      } catch (e) {
        console.warn('[analyzeNutrition] AI failed, falling back to local:', e);
        return res.status(200).json(localResult);
      }
    } else {
      const localResult = analyzeLocally(cartItems, menuDoc);
      return res.status(200).json(localResult);
    }
  } catch (error) {
    console.error('[analyzeNutrition] Error:', error);
    return res.status(500).json({ errorMessage: String(error) });
  }
};