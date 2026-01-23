'use client'

import { useOrders } from "@/context/context";
import SearchBar from "@/components/ui/searchBar";
import { useState } from "react";
import Link from "next/link";
import { IconBell, IconPlus } from "@tabler/icons-react";
import OrderCard from "./orderCard";
import Column from "./column";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";

export default function OrdersBoard () {
  const { ordersBoard, columns, moveOrder, activeOrder, setActiveOrder } = useOrders();
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState("PENDENTE");

  // --- Mobile Logic (Tabs) ---
  const tabs = [
    { id: "PENDENTE", label: "PENDENTE", statuses: ["PENDENTE", "Pendente"] },
    { id: "EM_PREPARACAO", label: "EM PREPARAÇÃO", statuses: ["EM_PREPARACAO", "Em preparação"] },
    { id: "A_CAMINHO", label: "A CAMINHO", statuses: ["A_CAMINHO", "A caminho"] },
    { id: "ENTREGUE", label: "ENTREGUE", statuses: ["ENTREGUE", "Entregue"] },
    { id: "CANCELADO", label: "CANCELADO", statuses: ["CANCELADO", "Cancelado"] }
  ];

  const getTabCount = (tabStatuses: string[]) => {
    return ordersBoard.filter(order => tabStatuses.includes(order.status_pedido)).length;
  };

  const filteredOrdersMobile = ordersBoard.filter(order => {
    const matchesSearch = 
      order.cardId.toLowerCase().includes(filter.toLowerCase()) ||
      order.nome_cliente.toLowerCase().includes(filter.toLowerCase()) ||
      order.status_pedido.toLowerCase().includes(filter.toLowerCase());
    
    const currentTab = tabs.find(t => t.id === activeTab);
    const matchesTab = currentTab ? currentTab.statuses.includes(order.status_pedido) : false;

    return matchesSearch && matchesTab;
  });

  const handleNextStatus = (orderId: string, currentStatus: string) => {
    let nextStatus = "";
    if (currentStatus === "PENDENTE" || currentStatus === "Pendente") nextStatus = "EM_PREPARACAO";
    else if (currentStatus === "EM_PREPARACAO" || currentStatus === "Em preparação") nextStatus = "A_CAMINHO";
    else if (currentStatus === "A_CAMINHO" || currentStatus === "A caminho") nextStatus = "ENTREGUE";
    
    if (nextStatus) {
      moveOrder(orderId, nextStatus);
    }
  };

  // --- Desktop Logic (DnD) ---
  function handleDragStart(event: DragStartEvent) {
    const order = ordersBoard.find((order) => order.cardId === event.active.id);
    if (order) setActiveOrder(order);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveOrder(null);
    const {active, over} = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 1. Se soltou diretamente na coluna (container vazio ou nas bordas)
    if (columns.some(col => col.id === overId)) {
      moveOrder(activeId, overId);
      return;
    }

    // 2. Se soltou sobre outro card
    const overOrder = ordersBoard.find((order) => order.cardId === overId);
    if (overOrder) {
      // Encontra a coluna correspondente ao status do pedido onde soltou
      const targetColumn = columns.find(col => 
        col.title === overOrder.status_pedido || col.id === overOrder.status_pedido
      );
      
      if (targetColumn) {
        moveOrder(activeId, targetColumn.id);
      }
    }
  }

  const filteredOrdersDesktop = ordersBoard.filter(order => 
    order.cardId.toLowerCase().includes(filter.toLowerCase()) ||
    order.nome_cliente.toLowerCase().includes(filter.toLowerCase()) ||
    order.status_pedido.toLowerCase().includes(filter.toLowerCase())
  );

  return(
    <div className="w-full h-full flex flex-col bg-[#F9F9F9] overflow-hidden">
      {/* Header */}
      <div className="w-full bg-white px-4 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex justify-between items-center w-full md:w-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Painel de Pedidos</h1>
          <div className="flex items-center gap-3 md:hidden">
             <button className="text-gray-500 hover:text-gray-700">
               <IconBell size={24} />
             </button>
             <div className="w-8 h-8 rounded-full bg-[#ec4913] text-white flex items-center justify-center font-bold text-sm">
               N
             </div>
          </div>
        </div>
        
        <div className="w-full md:w-96">
          <SearchBar 
            placeholder="Buscar por ID, cliente ou status" 
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="hidden md:flex items-center gap-3">
             <Link href="/loginPage" className="bg-[#ec4913] hover:bg-[#d14010] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-200 transition-colors">
               Novo Pedido
             </Link>
        </div>
      </div>

      {/* MOBILE CONTENT (Tabs + List) */}
      <div className="md:hidden flex-1 w-full min-h-0 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="w-full bg-white border-b border-gray-200 flex overflow-x-auto shrink-0 no-scrollbar">
            {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-3 text-sm font-medium border-b-2 transition-colors flex justify-center items-center gap-2 ${
                activeTab === tab.id 
                    ? "border-[#ec4913] text-[#ec4913]" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? "bg-orange-100 text-[#ec4913]" : "bg-gray-100 text-gray-600"
                }`}>
                {getTabCount(tab.statuses)}
                </span>
            </button>
            ))}
        </div>

        {/* Orders List */}
        <div className="flex-1 w-full min-h-0 px-4 py-4 overflow-y-auto bg-gray-50">
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {filteredOrdersMobile.length > 0 ? (
                filteredOrdersMobile.map((order) => (
                <OrderCard 
                    key={order.cardId} 
                    order={order} 
                    onAdvance={() => handleNextStatus(order.cardId, order.status_pedido)}
                />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <p>Nenhum pedido encontrado nesta etapa.</p>
                </div>
            )}
            </div>
        </div>
      </div>

      {/* DESKTOP CONTENT (Kanban Board) */}
      <div className="hidden md:flex flex-1 w-full min-h-0 px-8 pb-4 overflow-x-auto overflow-y-hidden">
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="flex h-full gap-6 min-w-max pt-4">
                {columns.map((column) => (
                  <Column 
                    key={column.id} 
                    column={column} 
                    orders={filteredOrdersDesktop.filter((order) => order.status_pedido === column.title || order.status_pedido === column.id)} 
                    activeOrder={activeOrder} 
                  />
                ))}
              </div>
              <DragOverlay>
                {activeOrder ? <OrderCard order={activeOrder} enableDrag={true} isDragging={true} /> : null}
              </DragOverlay>
          </DndContext>
      </div>

      {/* Mobile FAB */}
      <Link href="/loginPage" className="fixed bottom-20 right-4 w-14 h-14 bg-[#ec4913] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#d14010] transition-colors z-50 md:hidden">
         <IconPlus size={32} />
      </Link>
    </div>
  )
}
