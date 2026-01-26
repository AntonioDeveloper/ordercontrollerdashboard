'use server';

import mongoose from 'mongoose';
import MenuSchema from '../models/menu';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllMenu = async (req: any, res: any) => {
  try {
    const conn = mongoose.connection;

    try {
      const menuColCount = await conn.db
        ?.collection('menu')
        .countDocuments()
        .catch(() => -1);
      console.log('[getAllMenu] clients count:', menuColCount);
    } catch (e) {
      console.warn('[getAllMenu] Unable to list collections:', e);
    }

    // Busca o documento único que contém os 4 arrays (salty_pizzas, sweet_pizzas, vegetarian_pizzas, beverages)
    const menuDoc = await MenuSchema.findOne().lean().exec();

    if (!menuDoc) {
      return res.status(200).json({
        salty_pizzas: [],
        sweet_pizzas: [],
        vegetarian_pizzas: [],
        beverages: [],
      });
    }

    const allMenuData = {
      salty_pizzas: menuDoc.pizzas_salgadas || [],
      sweet_pizzas: menuDoc.pizzas_doces || [],
      vegetarian_pizzas: menuDoc.pizzas_vegetarianas || [],
      beverages: menuDoc.bebidas || [],
    };

    return res.status(200).json(allMenuData ?? []);
  } catch (error) {
    console.error('[getAllMenu] Error:', error);
    return res.status(500).json({ errorMessage: String(error) });
  }
};
