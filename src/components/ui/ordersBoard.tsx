'use client'

import Column from "./column";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import OrderCard from "./orderCard";
import { useOrders } from "@/context/context";

export default function OrdersBoard () {
  const { ordersBoard, columns, activeOrder, setActiveOrder, moveOrder } = useOrders();

  function handleDragStart(event: DragStartEvent) {
    const order = ordersBoard.find((order) => order.cardId === event.active.id);
    if (order) setActiveOrder(order);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveOrder(null);
    const {active, over} = event;
    if (!over) return;
    moveOrder(active.id as string, over.id as string);
  }

  return(
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="wscreen hfull bg-slate-100 flex justify-evenly">
        {columns.map((column) => (
          <Column 
            key={column.id} 
            column={column}
            orders={ordersBoard.filter((order) => {
              // Log to debug what's happening with each order
              console.log(`Order: ${order.cardId}, Status: ${order.status_pedido}, Column Title: ${column.title}, Column ID: ${column.id}`);
              // Check if status matches either the column title or column ID
              return order.status_pedido === column.title || order.status_pedido === column.id;
            })}
            activeOrder={activeOrder}
          />
        ))}
      </div>
      <DragOverlay>
        {activeOrder ? <OrderCard order={activeOrder} /> : null}
      </DragOverlay>
    </DndContext>
  )
}