'use client'

import { ColumnType } from "@/model/columnType";
import { OrderType } from "@/model/orderType";
import OrderCard from "./orderCard";
import { useDroppable } from "@dnd-kit/core";

interface ColumnProps {
  column: ColumnType;
  orders: OrderType[];
  activeOrder: OrderType | null;
}

export default function Column ({column, orders, activeOrder}: ColumnProps) {
console.log("activeOrder", activeOrder)

  const {setNodeRef} = useDroppable({
    id: column.id,
  });

  return(
    <div ref={setNodeRef} className="w-9/10 h-auto bg-slate-700 flex flex-col gap-4">
      <h1 className="text-slate-800">{column.title}</h1>
      {orders.map((order) => {
        return <OrderCard key={order.cardId} order={order} isDragging={activeOrder?.cardId === order.cardId} />
      })}
    </div>
  )
}