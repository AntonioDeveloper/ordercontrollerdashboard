'use client'

import Minicart from "@/components/ui/minicart";
import { useOrders } from "@/context/context";
import Image from 'next/image';

export default function BeveragesPage() {
  const { allMenuItems, cartItems, setCartItems } = useOrders();
  const { beverages } = allMenuItems;

  return (
    <>
      <h1>Pizzas Doce</h1>
      <div className="w-full h-full flex">
        <div className="w-2/3 h-full flex flex-wrap gap-10">
          {
            beverages.map((beverage) => (
              <div key={beverage.nome} className="w-1/3 h-auto max-h-1/2 border border-zinc-300 rounded-[8px] flex flex-col items-center">
                <h2 className="text-zinc-600 text-2xl font-bold text-center">{beverage.nome}</h2>
                <Image src="/img/generic-beverage.png" alt={beverage.nome} width={200} height={150} className="w-1/2 h-1/2 object-cover rounded-[8px]" />
                <p className="text-zinc-600 text-sm text-center">{beverage.ingredientes_principais.join(", ")}</p>
                <p className="text-zinc-600 text-sm text-center">R$ {beverage.preco.toFixed(2)}</p>
                <button className="w-3x py-1 px-1 bg-[#ec4913] text-white text-sm font-bold rounded-[8px] cursor-pointer" onClick={() => setCartItems([...cartItems, {nome_item: beverage.nome, quantidade: 1, preco: beverage.preco}])}>Adicionar ao pedido</button>
              </div>
            ))
          }
        </div>

        <Minicart items={cartItems} setItems={setCartItems} />
      </div>
    </>
  );
}