'use client'

import Minicart from "@/components/ui/minicart";
import ProductCard from "@/components/ui/productCard";
import { useOrders } from "@/context/context";
import SearchBar from "@/components/ui/searchBar";
import { useState } from "react";

export default function SweetPizzasPage() {
  const { allMenuItems, addToCart, cartItems, setCartItems } = useOrders();
  const { sweet_pizzas } = allMenuItems;
  const [filter, setFilter] = useState("");

  const filteredPizzas = sweet_pizzas.filter(p => 
    p.nome.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="w-full h-full flex bg-[#F9F9F9]">
      {/* Main Content Area */}
      <div className="flex-grow h-full flex flex-col p-8 overflow-hidden">
        
        {/* Header / Search */}
        <div className="w-full max-w-3xl mb-8">
            <SearchBar 
                placeholder="Buscar Pizza Doce..." 
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>

        {/* Product Grid */}
        <div className="flex-grow overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {
                filteredPizzas.map((pizza) => (
                    <ProductCard
                        key={pizza.nome}
                        name={pizza.nome}
                        description={pizza.ingredientes_principais.join(", ")}
                        imageSrc="/img/generic-pizza.png" 
                        onAdd={() => addToCart({nome_item: pizza.nome, quantidade: 1, preco: pizza.preco})}
                    />
                ))
            }
            </div>
            {filteredPizzas.length === 0 && (
                <div className="w-full text-center py-20 text-gray-400">
                    Nenhum produto encontrado.
                </div>
            )}
        </div>
      </div>
      {/* Right Sidebar (Cart) */}
      <div className="w-[400px] h-full flex flex-col bg-white shadow-xl z-10 overflow-y-auto">
        <Minicart items={cartItems} setItems={setCartItems} />
      </div>
    </div>
  );
}
