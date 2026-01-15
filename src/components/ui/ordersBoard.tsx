'use client'

import Column from "./column";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import OrderCard from "./orderCard";
import { useOrders } from "@/context/context";
import SearchBar from "@/components/ui/searchBar";
import { useState } from "react";

export default function OrdersBoard () {
  const { ordersBoard, columns, activeOrder, setActiveOrder, moveOrder } = useOrders();
  const [filter, setFilter] = useState("");

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

  // Filter orders based on search
  const filteredOrders = ordersBoard.filter(order => 
    order.cardId.toLowerCase().includes(filter.toLowerCase()) ||
    order.nome_cliente.toLowerCase().includes(filter.toLowerCase()) ||
    order.status_pedido.toLowerCase().includes(filter.toLowerCase())
  );

  return(
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="w-full h-full flex flex-col bg-[#F9F9F9] overflow-hidden">
        {/* Header - Fixed Height */}
        <div className="w-full px-8 py-8 flex justify-between items-center shrink-0">
          <h1 className="text-3xl font-bold text-gray-800">Painel de Pedidos</h1>
          <div className="w-96">
            <SearchBar 
              placeholder="Buscar por ID, cliente ou status" 
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Board Container - Flexible Height with Scroll */}
        <div className="flex-1 w-full min-h-0 px-8 pb-4 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full gap-6 min-w-max">
            {columns.map((column) => (
              <Column 
                key={column.id} 
                column={column}
                orders={filteredOrders.filter((order) => {
                  return order.status_pedido === column.title || order.status_pedido === column.id;
                })}
                activeOrder={activeOrder}
              />
            ))}
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeOrder ? <OrderCard order={activeOrder} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
