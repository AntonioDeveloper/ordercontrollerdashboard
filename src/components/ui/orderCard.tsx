'use client'

import {OrderType} from "@/model/orderType"
import { useDraggable } from "@dnd-kit/core"
import { IconMotorbike, IconBuildingStore, IconCreditCard, IconClock } from "@tabler/icons-react";

interface OrderCardProps {
  order: OrderType;
  isDragging?: boolean;
}

export default function OrderCard ({order, isDragging} : OrderCardProps) {

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: order.cardId
  });

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    zIndex: isDragging ? 999 : undefined,
  } : undefined;

  // Mock data logic
  const isDelivery = order.endereco && order.endereco.length > 0;
  const isPaid = order.status_pedido === 'Entregue';
  const timeMock = "10:30"; // Placeholder as we don't have timestamp in OrderType

  const cardContent = (
    <div className="w-full h-full p-4 flex flex-col justify-between">
      {/* Header: ID and Time */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-[#ec4913] font-bold text-lg">#{order.cardId.substring(0, 5)}</span>
        <div className="flex items-center text-gray-400 text-xs">
            <IconClock size={14} className="mr-1" />
            {timeMock}
        </div>
      </div>

      {/* Client Info */}
      <div className="mb-3">
        <h3 className="font-bold text-gray-800 text-base mb-1">{order.nome_cliente}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">
          {order.pedido.quantidade}x {order.pedido.pizza_sabor} ({order.pedido.tamanho})
          {order.pedido.observacoes && <span className="block text-xs italic mt-1 text-gray-400">Obs: {order.pedido.observacoes}</span>}
        </p>
      </div>

      {/* Footer: Delivery and Payment */}
      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        <div className="flex items-center text-gray-500 text-xs font-medium">
            {isDelivery ? <IconMotorbike size={16} className="mr-1.5" /> : <IconBuildingStore size={16} className="mr-1.5" />}
            {isDelivery ? "Delivery" : "Retirada"}
        </div>
        
        <div className={`flex items-center text-xs font-bold ${isPaid ? "text-green-600" : "text-yellow-600"}`}>
            <IconCreditCard size={16} className="mr-1.5" />
            {isPaid ? "Pago" : "Pendente"}
        </div>
      </div>
    </div>
  );

  if (isDragging) {
    return (
        <div 
            ref={setNodeRef} 
            style={style}
            className="w-full bg-white rounded-xl shadow-lg border-2 border-[#ec4913] opacity-90 cursor-grabbing relative"
        >
            {cardContent}
        </div>
    )
  }

  return(
    <div 
        ref={setNodeRef} 
        {...listeners} 
        {...attributes} 
        style={style} 
        className="w-full bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 cursor-grab transition-shadow active:cursor-grabbing"
    >
        {cardContent}
    </div>
  )
}