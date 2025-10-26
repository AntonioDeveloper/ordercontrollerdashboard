'use client'

import { useOrders } from "@/context/context";
import Image from 'next/image'

export default function SaltyPizzasPage() {
  const { allMenuItems } = useOrders();
  const { salty_pizzas } = allMenuItems;

  console.log("salty_pizzas", salty_pizzas);

  return (
    <div className="w-full h-full flex flex-col">
      <h1>Salty Pizzas</h1>

      <div className="w-full h-full flex flex-wrap items-center gap-0.5">
        {
          salty_pizzas.map((pizza) => (
            <div key={pizza.nome} className="w-1/3 h-auto max-h-1/2 border border-zinc-300 rounded-[8px] flex flex-col items-center">
              <h2 className="text-zinc-600 text-2xl font-bold text-center">{pizza.nome}</h2>
              <Image src="/img/generic-pizza.png" alt={pizza.nome} width={200} height={150} className="w-1/2 h-1/2 object-cover rounded-[8px]" />
              <p className="text-zinc-600 text-sm text-center">{pizza.ingredientes_principais.join(", ")}</p>
              <p className="text-zinc-600 text-sm text-center">R$ {pizza.preco.toFixed(2)}</p>
              <button className="w-1/3 py-1 px-1 bg-[#ec4913] text-white text-sm font-bold rounded-[8px]">Adicionar ao pedido</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}