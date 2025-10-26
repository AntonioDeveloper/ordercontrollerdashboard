export interface Root {
  salty_pizzas: SaltyPizza[];
  sweet_pizzas: SweetPizza[];
  vegetarian_pizzas: VegetarianPizza[];
  beverages: Beverage[];
}

export interface SaltyPizza {
  nome: string;
  ingredientes_principais: string[];
  preco: number;
  calorias_por_fatia_estimada: number;
}

export interface SweetPizza {
  nome: string;
  ingredientes_principais: string[];
  preco: number;
  calorias_por_fatia_estimada: number;
}

export interface VegetarianPizza {
  nome: string;
  ingredientes_principais: string[];
  preco: number;
  calorias_por_fatia_estimada: number;
}

export interface Beverage {
  nome: string;
  ingredientes_principais: string[];
  preco: number;
  calorias_por_porcao_estimada: number;
}
