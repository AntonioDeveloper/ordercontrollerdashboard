'use client'

import {OrderType} from "@/model/orderType"
import { IconMotorbike, IconBuildingStore, IconCreditCard, IconClock, IconChevronRight } from "@tabler/icons-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface OrderCardProps {
  order: OrderType;
  onAdvance?: () => void;
  enableDrag?: boolean;
  isDragging?: boolean;
  dndProps?: {
      setNodeRef?: (element: HTMLElement | null) => void;
      style?: React.CSSProperties;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attributes?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listeners?: any;
  }
}

export default function OrderCard ({order, onAdvance, enableDrag = false, isDragging = false, dndProps} : OrderCardProps) {
  // Mock data logic
  const isDelivery = order.endereco && order.endereco.length > 0;
  const isPaid = order.status_pedido === 'Entregue';
  const isDelivered = order.status_pedido === "Entregue";
  const isCanceled = order.status_pedido === "Cancelado";
  const timeMock = "10:30"; // Placeholder as we don't have timestamp in OrderType
  const itemsText = Array.isArray(order.pedido)
    ? order.pedido
        .map(item => `${item.quantidade}x ${item.nome_item}${item.tamanho ? ` (${item.tamanho})` : ''}${item.observacoes ? ` - Obs: ${item.observacoes}` : ''}`)
        .join(', ')
    : `${order.pedido.quantidade}x ${order.pedido.pizza_sabor} (${order.pedido.tamanho})${order.pedido.observacoes ? ` - Obs: ${order.pedido.observacoes}` : ''}`;

  const getButtonText = (status: string) => {
    switch(status) {
        case "EM_PREPARACAO": 
        case "Em preparação": return "Avançar para entrega";
        case "A_CAMINHO": 
        case "A caminho": return "Concluir entrega";
        case "ENTREGUE": 
        case "Entregue": return "Pedido Entregue";
        default: return "Avançar";
    }
  };

  const { setNodeRef, style, attributes, listeners } = dndProps || {};

  const cardContent = (
    <div className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${enableDrag ? 'cursor-grab active:cursor-grabbing hover:shadow-md' : ''}`}>
        <div className="flex flex-1">
            {/* Barra de Status */}
            <div className="w-1.5 bg-[#ec4913] shrink-0"></div>
            
            <div className="flex-1 p-4">
                {/* Header: ID e Time */}
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[#ec4913] font-bold text-lg">#{order.cardId.substring(0, 5)}</span>
                    <div className="flex items-center text-gray-400 text-xs">
                        <IconClock size={14} className="mr-1" />
                        {timeMock}
                    </div>
                </div>

                <div className="mb-3">
                    <h3 className="font-bold text-gray-800 text-base mb-1">{order.nome_cliente}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                    {itemsText}
                    </p>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center text-gray-500 text-xs font-medium">
                        {isDelivery ? <IconMotorbike size={16} className="mr-1.5" /> : <IconBuildingStore size={16} className="mr-1.5" />}
                        {isDelivery ? "Delivery" : "Retirada"}
                    </div>
                    
                    <div className={`flex items-center text-xs font-bold ${isPaid ? "text-green-600" : "text-[#ec4913]"}`}>
                        <IconCreditCard size={16} className="mr-1.5" />
                        {isPaid ? "Pago" : "Pendente"}
                    </div>
                </div>
            </div>
        </div>

        {/* Action Button - Visível somente se Drag não estiver ativado e o status do pedido não for cancelado */}
        {!enableDrag && !isCanceled && (
            <button 
                onClick={isDelivered ? undefined : onAdvance}
                className={`w-full ${isDelivered ? 'bg-green-600 cursor-default' : 'bg-[#ec4913] hover:bg-[#d14010]'} text-white py-3 font-semibold text-sm flex items-center justify-center transition-colors gap-1`}
            >
                {getButtonText(order.status_pedido)}
                {!isDelivered && <IconChevronRight size={18} />}
            </button>
        )}
    </div>
  );

  if (isDragging && enableDrag) {
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

  return (
      <div 
        ref={setNodeRef}
        style={style}
        {...listeners} 
        {...attributes}
        className="w-full"
      >
          {cardContent}
      </div>
  )
}

export function DraggableOrderCard({order, isDragging}: {order: OrderType, isDragging?: boolean}) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
      id: order.cardId,
      data: {
        order
      }
    });
  
    const style = {
      transform: CSS.Translate.toString(transform),
      transition,
      zIndex: isDragging ? 999 : undefined,
    };
  
    return <OrderCard 
              order={order} 
              enableDrag={true} 
              isDragging={isDragging}
              dndProps={{setNodeRef, style, attributes, listeners}} 
           />
  }
