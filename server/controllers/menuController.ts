'use server';

import mongoose from 'mongoose';
import MenuSchema from '../models/menu';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllMenu = async (req: any, res: any) => {
  try {
    const conn = mongoose.connection;
    const dbName = conn?.db?.databaseName;
    const modelName = MenuSchema.modelName;
    const collectionName = MenuSchema.collection?.name;

    // Log de diagnóstico
    console.log('[getAllMenu] DB:', dbName);
    console.log('[getAllMenu] Model:', modelName);
    console.log('[getAllMenu] Collection:', collectionName);

    try {
      const collections = await conn.db?.listCollections().toArray();
      console.log(
        '[getAllMenu] Collections:',
        collections?.map((c) => c.name)
      );

      // Contar documentos nas coleções comuns para diagnóstico
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

    // Se não houver documento ou ele não tiver a estrutura esperada, retorna objeto vazio
    if (!menuDoc) {
      return res.status(200).json({
        salty_pizzas: [],
        sweet_pizzas: [],
        vegetarian_pizzas: [],
        beverages: [],
      });
    }

    // Retorna o objeto completo com os 4 arrays (cada um pode ter até 10 itens)
    const allMenuData = {
      salty_pizzas: menuDoc.pizzas_salgadas || [],
      sweet_pizzas: menuDoc.pizzas_doces || [],
      vegetarian_pizzas: menuDoc.pizzas_vegetarianas || [],
      beverages: menuDoc.bebidas || [],
    };
    // Sempre retorna 200 com array (vazio ou preenchido) para facilitar consumo no frontend
    return res.status(200).json(allMenuData ?? []);
  } catch (error) {
    console.error('[getAllMenu] Error:', error);
    return res.status(500).json({ errorMessage: String(error) });
  }
};
