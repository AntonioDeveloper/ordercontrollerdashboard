import mongoose, { Schema, Document } from 'mongoose';

export interface ItemPizza {
  nome: string;
  ingredientes_principais: string[];
  preco: number;
  calorias_por_fatia_estimada: number;
}

export interface ItemBeverage {
  nome: string;
  ingredientes_principais: string[];
  preco: number;
  calorias_por_fatia_estimada: number;
}

export interface CompleteMenu extends Document {
  pizzas_salgadas: ItemPizza[];
  pizzas_doces: ItemPizza[];
  pizzas_vegetarianas: ItemPizza[];
  bebidas: ItemBeverage[];
}

const ItemPizzaSchema = new Schema<ItemPizza>({
  nome: { type: String, required: true },
  ingredientes_principais: { type: [String], required: true },
  preco: { type: Number, required: true },
  calorias_por_fatia_estimada: { type: Number, required: true },
});

const ItemBeverageSchema = new Schema<ItemBeverage>({
  nome: { type: String, required: true },
  ingredientes_principais: { type: [String], required: true },
  preco: { type: Number, required: true },
  calorias_por_fatia_estimada: { type: Number, required: true },
});

const MenuSchema = new mongoose.Schema(
  {
    pizzas_salgadas: { type: [ItemPizzaSchema], required: true },
    pizzas_doces: { type: [ItemPizzaSchema], required: true },
    pizzas_vegetarianas: { type: [ItemPizzaSchema], required: true },
    bebidas: { type: [ItemBeverageSchema], required: true },
  },
  { collection: 'menu' }
);

export default mongoose.model<CompleteMenu>('Menu', MenuSchema);
