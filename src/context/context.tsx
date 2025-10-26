'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { OrderType } from '@/model/orderType';
import { ColumnType } from '@/model/columnType';
import { ClientType } from '@/model/clientType';
import { usePathname } from 'next/navigation';
import { Root } from '@/model/menu';

type OrdersContextValue = {
  allOrders: OrderType[];
  ordersBoard: OrderType[];
  allMenuItems: Root;
  setOrdersBoard: React.Dispatch<React.SetStateAction<OrderType[]>>;
  columns: ColumnType[];
  activeOrder: OrderType | null;
  setActiveOrder: React.Dispatch<React.SetStateAction<OrderType | null>>;
  activeOrderId: string;
  setActiveOrderId: React.Dispatch<React.SetStateAction<string>>;
  orderStatus: string;
  setOrderStatus: React.Dispatch<React.SetStateAction<string>>;
  fetchOrders: () => Promise<void>;
  fetchMenuItems: () => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  moveOrder: (orderId: string, columnId: string) => void;
  allClients: ClientType[];
  updateClientData: (id: string, clientData: ClientType) => Promise<void>;
  getPathName: () => void;
  currentPath: string;
  menuPage: boolean;
  
  
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [allOrders, setAllOrders] = useState<OrderType[]>([]);
  const [allMenuItems, setAllMenuItems] = useState<Root>({
    salty_pizzas: [],
    sweet_pizzas: [],
    vegetarian_pizzas: [],
    beverages: [],
  });
  const [ordersBoard, setOrdersBoard] = useState<OrderType[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderType | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string>('');
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [allClients, setAllClients] = useState<ClientType[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const pathname = usePathname();

  const [menuPage, setMenuPage] = useState(false);

  const columns: ColumnType[] = useMemo(() => [
    { id: 'EM_PREPARACAO', title: 'Em preparação' },
    { id: 'A_CAMINHO', title: 'A caminho' },
    { id: 'ENTREGUE', title: 'Entregue' },
    { id: 'CANCELADO', title: 'Cancelado' },
    { id: 'PENDENTE', title: 'Pendente' },
  ], []);

  const getPathName = () => {
    if (pathname === '/menuPage' || pathname === '/saltyPizzasPage' || pathname === '/sweetPizzasPage' || pathname === '/vegetarianPizzasPage' || pathname === '/beveragesPage') {
      setMenuPage(true);
      setCurrentPath(pathname);
    } else {
      setMenuPage(false);
      setCurrentPath(pathname);
    }
  }

  
  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/clients');
      if (!response.ok) {
        console.error('[OrdersProvider] GET /api/clients failed', response.status, response.statusText);
        setAllClients([]);
        return;
      }
      const data: ClientType[] = await response.json();
      setAllClients(data);
    } catch (e) {
      console.error('[OrdersProvider] GET /api/clients error', e);
      setAllClients([]);
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/orders');
      if (!response.ok) {
        console.error('[OrdersProvider] GET /api/orders failed', response.status, response.statusText);
        setAllOrders([]);
        setOrdersBoard([]);
        return;
      }
      const data: OrderType[] = await response.json();
      setAllOrders(data);
      setOrdersBoard(data);
    } catch (e) {
      console.error('[OrdersProvider] GET /api/orders error', e);
      setAllOrders([]);
      setOrdersBoard([]);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/menu');
      
      if (!response.ok) {
        console.error('[OrdersProvider] GET /api/menu failed', response.status, response.statusText);
        setAllMenuItems({
          salty_pizzas: [],
          sweet_pizzas: [],
          vegetarian_pizzas: [],
          beverages: [],
        });
        return;
      }
      const data: Root = await response.json();      
      setAllMenuItems(data);
    } catch (e) {
      console.error('[OrdersProvider] GET /api/menu error', e);
      setAllMenuItems({
        salty_pizzas: [],
        sweet_pizzas: [],
        vegetarian_pizzas: [],
        beverages: [],
      });
    }
  }
  
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/orders/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_pedido: status }),
      });
      if (!response.ok) {
        console.error('[OrdersProvider] PUT /api/orders/update failed', response.status, response.statusText);
        return;
      }
      const updated = await response.json();
      setOrdersBoard(prev => prev.map(o => o._id === updated._id ? { ...o, status_pedido: updated.status_pedido } : o));
      setAllOrders(prev => prev.map(o => o._id === updated._id ? { ...o, status_pedido: updated.status_pedido } : o));
    } catch (e) {
      console.error('[OrdersProvider] PUT /api/orders/update error', e);
    }
  };

  const updateClientData = async (id: string, clientData: ClientType) => {
    console.log("Client Data CTX", clientData);
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/clients/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientData }),
      });
      if (!response.ok) {
        console.error('[OrdersProvider] PUT /api/clients/update failed', response.status, response.statusText);
        return;
      }
      const updated = await response.json();
      console.log("updated", updated);
      setAllClients(prev => prev.map(c => c._id === updated._id ? { ...c, ...updated } : c));
      // setOrdersBoard(prev => prev.map(o => o._id === updated._id ? { ...o, status_pedido: updated.status_pedido } : o));
      // setAllOrders(prev => prev.map(o => o._id === updated._id ? { ...o, status_pedido: updated.status_pedido } : o));
    } catch (e) {
      console.error('[OrdersProvider] PUT /api/orders/update error', e);
    }
  };

  const moveOrder = (orderId: string, columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    if (!column) return;

    const newStatus = column.title as OrderType['status_pedido'];
    setOrdersBoard(prev =>
      prev.map(order => order.cardId === orderId ? { ...order, status_pedido: newStatus } : order)
    );

    const order = ordersBoard.find(o => o.cardId === orderId);
    if (order?._id) {
      setActiveOrderId(order._id);
      setOrderStatus(columnId);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchOrders();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (orderStatus && activeOrderId) {
      updateOrderStatus(activeOrderId, orderStatus);
    }
  }, [orderStatus, activeOrderId]);

  const value: OrdersContextValue = {
    allOrders,
    ordersBoard,
    setOrdersBoard,
    columns,
    activeOrder,
    setActiveOrder,
    activeOrderId,
    setActiveOrderId,
    orderStatus,
    setOrderStatus,
    fetchOrders,
    updateOrderStatus,
    moveOrder,
    allClients,
    updateClientData,
    getPathName,
    currentPath,
    menuPage,
    fetchMenuItems,
    allMenuItems
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return ctx;
}