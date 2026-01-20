'use client'

import { useOrders } from "@/context/context";
import { IconShoppingBag, IconChevronUp, IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import Minicart from "./minicart";
import ModalComponent from "./modalComponent";

export default function MobileBottomCart() {
  const { cartItems, setCartItems, createOrder } = useOrders();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  if (cartItems.length === 0) return null;

  const total = cartItems.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantidade, 0);

  const handleFinalize = async () => {
    await createOrder();
    setCartItems([]);
    setIsDetailsOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 z-50 md:hidden pb-safe">
            {/* Summary Row */}
            <div 
                className="flex items-center justify-between mb-3 cursor-pointer"
                onClick={() => setIsDetailsOpen(true)}
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <IconShoppingBag className="text-gray-400" size={28} />
                        <span className="absolute -top-1 -right-1 bg-[#ec4913] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                            {itemCount}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">Subtotal</span>
                        <span className="text-gray-900 font-bold text-lg">R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
                
                <div className="flex items-center text-gray-400 text-xs font-bold gap-1">
                    VER PEDIDO
                    <IconChevronUp size={16} />
                </div>
            </div>

            {/* Finalize Button */}
            <button 
                onClick={handleFinalize}
                className="w-full bg-[#ec4913] hover:bg-[#d14010] active:bg-[#b03a0d] text-white font-bold py-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
                Finalizar Pedido
                <IconArrowRight size={20} />
            </button>
        </div>

        {/* Full Screen Cart Details Modal */}
        {isDetailsOpen && (
            <div className="fixed inset-0 z-[60] bg-white flex flex-col md:hidden animate-in slide-in-from-bottom duration-300">
                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-800">Seu Pedido</h2>
                        {cartItems.length > 0 && (
                            <button 
                                onClick={() => setCartItems([])}
                                className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full"
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={() => setIsDetailsOpen(false)}
                        className="text-gray-500 font-medium text-sm bg-gray-50 px-3 py-1.5 rounded-lg"
                    >
                        Fechar
                    </button>
                </div>
                <div className="flex-1 overflow-hidden">
                    <Minicart 
                        items={cartItems} 
                        setItems={setCartItems} 
                        hideHeader={true} 
                        className="p-4 border-none" 
                    />
                </div>
            </div>
        )}

         <ModalComponent open={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)}>
            <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconShoppingBag className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Realizado!</h2>
                <p className="text-gray-500">Seu pedido foi enviado para a cozinha.</p>
                <button 
                    onClick={() => setIsSuccessModalOpen(false)}
                    className="mt-6 w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl"
                >
                    Fechar
                </button>
            </div>
        </ModalComponent>
    </>
  );
}
