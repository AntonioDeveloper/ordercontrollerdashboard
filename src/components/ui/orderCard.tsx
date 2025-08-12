'use client'

import {OrderType} from "@/model/orderType"
import { useDraggable } from "@dnd-kit/core"

interface OrderCardProps {
  order: OrderType;
  isDragging?: boolean;
}

export default function OrderCard ({order, isDragging} : OrderCardProps) {

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: order.cardId
  });

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px),`
  } : undefined;

  if (isDragging) {
    return <div ref={setNodeRef} className="w-8/10 min-h-24 bg-slate-400 flex items-center justify-center" />
  }

  return(
    <div ref={setNodeRef} {...listeners} {...attributes} style={style} className="cursor-grab w-8/10 min-h-24 bg-slate-100 flex items-center justify-center" >
      <div className="w-full h-auto">
        <p>{order.cardId}</p>
        <p>{order.nome_cliente}</p>
        <p>{order.endereco}</p>
        <p>{order.status_pedido}</p>
      </div>
    </div>
  )
}