'use client'

import Minicart from "@/components/ui/minicart";
import ProductCard from "@/components/ui/productCard";
import { useOrders } from "@/context/context";
import SearchBar from "@/components/ui/searchBar";
import { useState } from "react";
import { IconUser } from "@tabler/icons-react";
import MobileProductCard from "@/components/ui/mobileProductCard";
import MobileBottomCart from "@/components/ui/mobileBottomCart";

export default function SaltyPizzasPage() {
  const { allMenuItems, addToCart, cartItems, setCartItems } = useOrders();
  const { salty_pizzas, sweet_pizzas, beverages } = allMenuItems;
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState<'salty' | 'sweet' | 'beverages'>('salty');

  // Desktop filtering (keeps existing logic for desktop view which is Salty Pizzas only)
  const filteredPizzas = salty_pizzas.filter(p => 
    p.nome.toLowerCase().includes(filter.toLowerCase())
  );

  // Mobile filtering
  const getCurrentMobileItems = () => {
    switch(activeTab) {
        case 'salty': return salty_pizzas;
        case 'sweet': return sweet_pizzas;
        case 'beverages': return beverages;
        default: return [];
    }
  };

  const mobileItems = getCurrentMobileItems();
  const filteredMobileItems = mobileItems.filter(p => 
    p.nome.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
        {/* Desktop View - Hidden on Mobile */}
        <div className="hidden md:flex w-full h-full bg-[#F9F9F9]">
            {/* Main Content Area */}
            <div className="flex-grow h-full flex flex-col p-8 overflow-hidden">
                
                {/* Header / Search */}
                <div className="w-full max-w-3xl mb-8">
                    <SearchBar 
                        placeholder="Buscar Produto..." 
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

        {/* Mobile View - Visible only on Mobile */}
        <div className="md:hidden w-full h-full flex flex-col bg-gray-50">
             {/* Header */}
             <div className="bg-white p-4 pb-2">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-2">
                       <span className="text-[#ec4913] font-black text-xl tracking-tighter">PIZZADASH</span>
                   </div>
                   <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                       <IconUser size={24} />
                   </div>
                </div>
                <SearchBar placeholder="O que você procura hoje?" onChange={(e) => setFilter(e.target.value)} />
             </div>

             {/* Tabs */}
             <div className="bg-white px-4 pb-0 flex gap-6 overflow-x-auto no-scrollbar border-b border-gray-100 sticky top-0 z-10">
                <button
                   onClick={() => setActiveTab('salty')}
                   className={`pb-3 pt-2 whitespace-nowrap font-bold text-sm transition-colors relative ${activeTab === 'salty' ? 'text-[#ec4913]' : 'text-gray-400'}`}
                >
                   Pizzas Salgadas
                   {activeTab === 'salty' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ec4913] rounded-t-full" />}
                </button>
                <button
                   onClick={() => setActiveTab('sweet')}
                   className={`pb-3 pt-2 whitespace-nowrap font-bold text-sm transition-colors relative ${activeTab === 'sweet' ? 'text-[#ec4913]' : 'text-gray-400'}`}
                >
                   Pizzas Doces
                   {activeTab === 'sweet' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ec4913] rounded-t-full" />}
                </button>
                 <button
                   onClick={() => setActiveTab('beverages')}
                   className={`pb-3 pt-2 whitespace-nowrap font-bold text-sm transition-colors relative ${activeTab === 'beverages' ? 'text-[#ec4913]' : 'text-gray-400'}`}
                >
                   Bebidas
                   {activeTab === 'beverages' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ec4913] rounded-t-full" />}
                </button>
             </div>

             {/* List */}
             <div className="flex-1 overflow-y-auto p-4 pb-32">
                <div className="flex flex-col">
                   {filteredMobileItems.map(item => (
                      <MobileProductCard
                         key={item.nome}
                         name={item.nome}
                         description={item.ingredientes_principais ? item.ingredientes_principais.join(", ") : ""}
                         price={item.preco}
                         imageSrc={activeTab === 'beverages' ? "/img/generic-beverage.png" : "/img/generic-pizza.png"}
                         onAdd={() => addToCart({nome_item: item.nome, quantidade: 1, preco: item.preco})}
                      />
                   ))}
                   {filteredMobileItems.length === 0 && (
                        <div className="w-full text-center py-20 text-gray-400">
                            Nenhum produto encontrado.
                        </div>
                   )}
                </div>
             </div>

             <MobileBottomCart />
        </div>
    </>
  );
}
