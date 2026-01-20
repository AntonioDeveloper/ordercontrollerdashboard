'use client'

import { useOrders } from "@/context/context";
import { MinicartItem } from "@/model/minicart";
import ModalComponent from "./modalComponent";
import { useState } from "react";
import { IconShoppingCart, IconTrash, IconPizza, IconGlass } from "@tabler/icons-react";
import NutritionPanel from "./nutritionPanel";

interface MinicartProps {
  items?: MinicartItem[];
  setItems?: (items: MinicartItem[]) => void;
  hideHeader?: boolean;
  className?: string;
}

export default function Minicart({ items = [], setItems, hideHeader = false, className = "" }: MinicartProps) {
  const { createOrder, currentClient, setIsSignUpModalOpen } = useOrders();
  const [isOpen, setIsOpen] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);

  const total = items.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const clearCart = () => {
    setItems?.([]);
  };

  const handleCreateOrder = async () => {
    if (items.length === 0) return;

    if (!currentClient) {
      setIsSignUpModalOpen(true);
      return;
    }

    const success = await createOrder();
    if (success) {
      setIsOpen(true);
      setItems?.([]); // Clear cart after order
    } else {
        alert("Erro ao criar o pedido. Por favor, tente novamente.");
    }
  };

  const getItemIcon = (name: string) => {
    // Simple heuristic for icon
    if (name.toLowerCase().includes('refrigerante') || name.toLowerCase().includes('suco') || name.toLowerCase().includes('água')) {
        return <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><IconGlass size={20} className="text-gray-600" /></div>
    }
    return <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><IconPizza size={20} className="text-gray-600" /></div>
  };

  return (
    <div className={`w-full h-full bg-white flex flex-col ${className ? className : 'p-6 border-l border-gray-100'}`}>
      
      {/* Header */}
      {!hideHeader && (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <IconShoppingCart className="text-[#ec4913]" size={28} />
          <h2 className="text-xl font-bold text-gray-800 leading-tight">Resumo do<br/>Pedido</h2>
        </div>
        
        {items.length > 0 && (
            <button 
                onClick={clearCart}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
                Limpar Pedido
            </button>
        )}
      </div>
      )}

      {/* Items List or Nutrition Panel */}
      <div className="flex-grow overflow-y-auto pr-2 -mr-2 mb-6">
        {showNutrition ? (
            <NutritionPanel />
        ) : (
            items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                    <p>Seu carrinho está vazio.</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-6">
                {items.map((item) => (
                    <li key={item.nome_item} className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            {getItemIcon(item.nome_item)}
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{item.nome_item}</p>
                                {/* Assuming generic size for now as it's not in the model */}
                                <p className="text-gray-400 text-xs">Tamanho: Padrão</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                             <button 
                                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-300 transition-colors cursor-pointer"
                                onClick={() => setItems?.(items.map(i => i.nome_item === item.nome_item && i.quantidade > 0 ? { ...i, quantidade: i.quantidade - 1 } : i).filter(i => i.quantidade > 0))}
                             >
                                -
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{item.quantidade}</span>
                            <button 
                                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-300 transition-colors cursor-pointer"
                                onClick={() => setItems?.(items.map(i => i.nome_item === item.nome_item ? { ...i, quantidade: i.quantidade + 1 } : i))}
                            >
                                +
                            </button>
                        </div>
                    </li>
                ))}
                </ul>
            )
        )}
      </div>

      {/* Footer / Total */}
      <div className="mt-auto border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-800 font-bold">Subtotal</p>
          <p className="text-gray-800 font-bold">R$ {total.toFixed(2)}</p>
        </div>

        <button
          onClick={() => setShowNutrition((s) => !s)}
          className="w-full mb-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors shadow-sm"
        >
          {showNutrition ? "Voltar para Itens" : "Mostrar Análise Nutricional"}
        </button>

        <button 
          onClick={handleCreateOrder}
          disabled={items.length === 0}
          className="w-full h-12 bg-[#ec4913] hover:bg-[#d14010] text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          Finalizar Pedido
        </button>
      </div>

      <ModalComponent open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="text-center p-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconPizza className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Realizado!</h2>
            <p className="text-gray-500">Seu pedido foi enviado para a cozinha.</p>
        </div>
      </ModalComponent>
    </div>
  );
}
