'use client'

import Column from "./column";
import { useState } from "react";
import { OrderType } from "../../model/orderType";
import {ColumnType} from "../../model/columnType";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import OrderCard from "./orderCard";

export default function Content () {
  
  const columns: ColumnType[] = [
    {id: "EM_PREPARACAO", title: "Em preparação"},    
    {id: "A_CAMINHO", title: "A caminho"},    
    {id: "ENTREGUE", title: "Entregue"},    
    {id: "CANCELADO", title: "Cancelado"},    
    {id: "PENDENTE", title: "Pendente"},    
  ];
  
  const initialOrders: OrderType[] = [
    {
      "id": "1",
      "nome_cliente": "Ana Silva",
      "status_pedido": "Em preparação",
      "endereco": "Rua das Flores, 123, Santo André - SP",
      "pedido": {
        "pizza_sabor": "Calabresa",
        "tamanho": "Grande",
        "quantidade": 1,
        "observacoes": "Sem cebola"
      }
    },
    {
      "id": "2",
      "nome_cliente": "Bruno Santos",
      "status_pedido": "A caminho",
      "endereco": "Av. Brasil, 456, Santo André - SP",
      "pedido": {
        "pizza_sabor": "Frango com Catupiry",
        "tamanho": "Média",
        "quantidade": 1,
        "observacoes": ""
      }
    },
    {
      "id": "3",
      "nome_cliente": "Carla Oliveira",
      "status_pedido": "Entregue",
      "endereco": "Alameda dos Anjos, 789, Santo André - SP",
      "pedido": {
        "pizza_sabor": "Portuguesa",
        "tamanho": "Grande",
        "quantidade": 2,
        "observacoes": "Uma com borda de cheddar"
      }
    },
    {
      "id": "4",
      "nome_cliente": "Daniel Pereira",
      "status_pedido": "Cancelado",
      "endereco": "Rua da Paz, 101, Santo André - SP",
      "pedido": {
        "pizza_sabor": "Quatro Queijos",
        "tamanho": "Pequena",
        "quantidade": 1,
        "observacoes": ""
      }
    },
    {
      "id": "5",
      "nome_cliente": "Eduarda Costa",
      "status_pedido": "Em preparação",
      "endereco": "Travessa da Felicidade, 222, Santo André - SP",
      "pedido": {
        "pizza_sabor": "Marguerita",
        "tamanho": "Grande",
        "quantidade": 1,
        "observacoes": "Extra manjericão"
      }
    },
    {
      "id": "6",
      "nome_cliente": "Felipe Rodrigues",
      "status_pedido": "A caminho",
      "endereco": "Praça Central, 333, Santo André - SP",
      "pedido": {
        "pizza_sabor": "Calabresa",
        "tamanho": "Média",
        "quantidade": 1,
        "observacoes": "Com borda de catupiry"
      }
    },
    {
      "id": "7",
      "nome_cliente": "Gabriela Almeida",
      "status_pedido": "Entregue",
      "endereco": "Rua do Comércio, 444, Santo André - SP",
      "pedido": {
        "pizza_sabor": "Chocolate com Morango",
        "tamanho": "Pequena",
        "quantidade": 1,
        "observacoes": "Para sobremesa"
      }
    },
    {
      "id": "8",
      "nome_cliente": "Henrique Souza",
      "status_pedido": "Em preparação",
      "endereco": "Av. dos Bandeirantes, 555, Santo André - SP",
      "pedido": {
        "pizza_sabor": "Rúcula com Tomate Seco",
        "tamanho": "Grande",
        "quantidade": 1,
        "observacoes": ""
      }
    },
    {
      "id": "9",
      "nome_cliente": "Isabela Lima",
      "status_pedido": "Pendente",
      "endereco": "Rua do Limoeiro, 666, Santo André - SP",
      "pedido": {
        "pizza_sabor": "Atum",
        "tamanho": "Média",
        "quantidade": 1,
        "observacoes": "Sem azeitona"
      }
    },
    {
      "id": "10",
      "nome_cliente": "João Vitor",
      "status_pedido": "A caminho",
      "endereco": "Estrada Velha, 777, Santo André - SP",
      "pedido": {
        "pizza_sabor": "Bacon com Milho",
        "tamanho": "Grande",
        "quantidade": 1,
        "observacoes": "Bem crocante"
      }
    }
  ];
  
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);
  const [activeOrder, setActiveOrder] = useState<OrderType | null>(null);

  function handleDragStart(event: DragStartEvent) {
    const order = orders.find((order) => order.id === event.active.id);
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

    setOrders((orders) =>
      orders.map((order) => {
        if (order.id === orderId) {
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
          orders={orders.filter((order) => order.status_pedido === column.title)}
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