'use client'

import Column from "./column";
import { useState, useEffect } from "react";
import { OrderType } from "../../model/orderType";
import {ColumnType} from "../../model/columnType";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import OrderCard from "./orderCard";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export default function Content () {

  const [allOrders, setAllOrders] = useState<OrderType[]>([]);
  const [ordersBoard, setOrdersBoard] = useState<OrderType[]>(allOrders);
  const [activeOrderId, setActiveOrderId] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState("");
  
  useEffect(() => {
    async function fetchData() {
      // You can await here
      const response = await fetch("http://127.0.0.1:3001/api/clients").then(res => res.json()).then(data => data)
      console.log("Fetched data:", response);
      
      setAllOrders(response);      
      setOrdersBoard(response);      
    }
    fetchData();
  }, []); 

  useEffect(() => {
    console.log(`Mudei status ${orderStatus}, ID ${activeOrderId}`);

    async function updateOrderStatus () {
      try{
        const response = await fetch(`http://127.0.0.1:3001/api/clients/update/${activeOrderId}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status_pedido: orderStatus
          })
        });

        if(!response.ok) {
          throw new Error("Falha em atualizar o pedido, tente novamente");
        }
      } catch (error) {
        console.error("Erro em atualizar o pedido, tente novamente", error)
      }
    }

    updateOrderStatus();
  }, [orderStatus, activeOrderId]);

  // console.log("SET ALL ORDERS", allOrders);

  const columns: ColumnType[] = [
    {id: "EM_PREPARACAO", title: "Em preparação"},    
    {id: "A_CAMINHO", title: "A caminho"},    
    {id: "ENTREGUE", title: "Entregue"},    
    {id: "CANCELADO", title: "Cancelado"},    
    {id: "PENDENTE", title: "Pendente"},    
  ];

  const [activeOrder, setActiveOrder] = useState<OrderType | null>(null);  

  function handleDragStart(event: DragStartEvent) {
    
    const order = ordersBoard.find((order) => order.cardId === event.active.id);

    if (order) {
      setActiveOrder(order);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveOrder(null);
    const {active, over} = event;

    if (!over) return;

    const orderId = active.id as string;
    const column = columns.find((column) => column.id === over.id);
    if (!column) return;

    const newStatus = column.title as OrderType['status_pedido'];
    const statusId = column.id; // Use the column ID for the API call

    if (activeOrder?._id) {
      setActiveOrderId(activeOrder._id);
    }
    
    setOrderStatus(statusId); // Send the ID to the backend

    setOrdersBoard((ordersBoard) =>
      ordersBoard.map((order) => {
        if (order.cardId === orderId) {
          return { ...order, status_pedido: newStatus };
        }
        return order;
      })
    );
  }

  return(
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div className="w-screen h-full bg-slate-100 flex justify-evenly">
        {columns.map((column) => {
          return <Column 
          key={column.id} 
          column={column}
          orders={ordersBoard.filter((order) => order.status_pedido === column.title)}
          activeOrder={activeOrder}
          />
        })}
    </div>
      <DragOverlay>
        {activeOrder ? <OrderCard order={activeOrder} /> : null}
      </DragOverlay>
      </DndContext>
  )
}