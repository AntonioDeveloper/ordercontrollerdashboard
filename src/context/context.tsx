'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { OrderType } from '@/model/orderType';
import { ColumnType } from '@/model/columnType';
import { ClientType } from '@/model/clientType';
import { usePathname } from 'next/navigation';
import { Root } from '@/model/menu';
import { MinicartItem } from '@/model/minicart';

// Essa variável está configurada de forma que funcione mesmo se
// a variável de ambiente em produção ainda não tiver sido configurada
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type SignUpClientResult = { ok: true; client: ClientType } | { ok: false; status: number; statusText: string; errorMessage?: string } | string | undefined;

type fetchClientResult = { ok: true; client: ClientType } | { ok: false; status: number; statusText: string; errorMessage?: string } | string | undefined;

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
  signUpClient: (clientData: Omit<ClientType, '_id'>, options?: { timeoutMs?: number }) => Promise<SignUpClientResult>;
  cartItems: MinicartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<MinicartItem[]>>;
  addToCart: (item: MinicartItem) => void;
  updateCartItemQuantity: (nome_item: string, delta: number) => void;
  removeCartItem: (nome_item: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  createOrder: () => Promise<boolean>;
  loginClient: (telefone: string) => Promise<SignUpClientResult>;
  logoutClient: () =>  Promise<void>;
  currentClient: ClientType | null;
  query: string;
  setQuery: (query: string) => void;
  fetchClient: (name: string) => Promise<fetchClientResult>;
  foundClient: ClientType | null;
  isSignUpModalOpen: boolean;
  setIsSignUpModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [currentClient, setCurrentClient] = useState<ClientType | null>(null);
  const [query, setQuery] = useState("");
  const [foundClient, setFoundClient] = useState<ClientType | null>(null);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  // Minicart state
  const [cartItems, setCartItems] = useState<MinicartItem[]>([]);
  // console.log('currentClient', currentClient);

  const columns: ColumnType[] = useMemo(() => [
    { id: 'EM_PREPARACAO', title: 'Em preparação' },
    { id: 'A_CAMINHO', title: 'A caminho' },
    { id: 'ENTREGUE', title: 'Entregue' },
    { id: 'CANCELADO', title: 'Cancelado' },
    { id: 'PENDENTE', title: 'Pendente' },
  ], []);

  const getPathName = () => {
    if (pathname === '/loginPage' || pathname === '/saltyPizzasPage' || pathname === '/sweetPizzasPage' || pathname === '/vegetarianPizzasPage' || pathname === '/beveragesPage') {
      setMenuPage(true);
      setCurrentPath(pathname);
    } else {
      setMenuPage(false);
      setCurrentPath(pathname);
    }
  }

  // Busca todos os clientes
  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clients`);
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
      const response = await fetch(`${API_URL}/api/orders`);
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
      const response = await fetch(`${API_URL}/api/menu`);
      
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
      const response = await fetch(`${API_URL}/api/orders/update/${id}`, {
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

  const createOrder = async () => {

    const charArray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];

    let cardIdCode: string = "";
    let i = 0;


    function genCardIdCode() {
      const assembleArray: string[] = [];
      do {
        assembleArray.push(charArray[Math.floor(Math.random() * charArray.length)])
        i++;
      } while (i < 6);

      cardIdCode = assembleArray.join("");
    }

    genCardIdCode();

    try {
      const response = await fetch(`${API_URL}/api/createOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "cardId": cardIdCode,
            "nome_cliente": currentClient?.nome_cliente,
            "status_pedido": "EM_PREPARACAO",
            "endereco": currentClient?.endereco,
            "pedido": cartItems.map(item => ({
                "nome_item": item.nome_item,
                "quantidade": item.quantidade,
                "preco": item.preco,
            }))
        }),
      });

      console.log("response", response);
      if (!response.ok) {
        console.error('[OrdersProvider] POST /api/clients failed', response.status, response.statusText);
        return false;
      }
      const newOrder = await response.json();
      setAllOrders(prev => [...prev, newOrder]);
      setOrdersBoard(prev => [...prev, newOrder]);
      return true;
    } catch (e) {
      console.error('[OrdersProvider] POST /api/createOrder error', e);
      return false;
    }
  };

  const updateClientData = async (id: string, clientData: ClientType) => {
    console.log("Client Data CTX", clientData);
    try {
      const response = await fetch(`${API_URL}/api/clients/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientData }),
      });
      if (!response.ok) {
        console.error('[OrdersProvider] PUT /api/clients/update failed', response.status, response.statusText);
        return;
      }
      const updated = await response.json();
      setAllClients(prev => prev.map(c => c._id === updated._id ? { ...c, ...updated } : c));      
    } catch (e) {
      console.error('[OrdersProvider] PUT /api/orders/update error', e);
    }
  };

  const signUpClient = async (clientData: Omit<ClientType, '_id'>, options?: { timeoutMs?: number }):Promise<SignUpClientResult> => {

    const timeoutMs = options?.timeoutMs ?? 8000;

    const controller = new AbortController();

    const { signal } = controller;

    let didTimeout = false;

    const timerId = setTimeout(() => { didTimeout = true; controller.abort(); }, timeoutMs);

    try {
      const response = await fetch(`${API_URL}/api/signUpClient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientData }),
        signal,
      });

      // Identifica o tipo de resposta do servidor para
      // decidir a forma de acessar a mensagem de erro
      if (!response.ok) {
        const ct = response.headers.get('content-type') || ''
        
        if(ct.includes('application/json')) {
          const body = await response.json();
          const errorMessage = body.errorMessage || body.message || JSON.stringify(body);
          return { ok: false, status: response.status, statusText: response.statusText, errorMessage };
        } else {
          const text = await response.text();
          return { ok: false, status: response.status, statusText: response.statusText, errorMessage: text };
        }
      }
      const newClient = await response.json();
      setAllClients(prev => [...prev, newClient]);

      return {
        ok: true, client: newClient
      }
    } catch (e) {
      console.error('[OrdersProvider] POST /api/signUpClient error', e);

      if ((e as Error).name === 'AbortError') {
        if (didTimeout) {
          return { ok: false, status: 0, statusText: 'Timeout', errorMessage: 'Tempo de resposta excedido.' }
        }
        return { ok: false, status: 0, statusText: 'Aborted', errorMessage: 'Requisição cancelada.' }
      }
      return { ok: false, status: 0, statusText: 'NetworkError' }
    } finally {
      clearTimeout(timerId);
    }
  };

  // Minicart
  const addToCart = (item: MinicartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.nome_item === item.nome_item);
      if (existing) {
        return prev.map(i => i.nome_item === item.nome_item ? { ...i, quantidade: i.quantidade + (item.quantidade || 1), preco: item.preco ?? i.preco } : i);
      }
      return [...prev, { ...item, quantidade: item.quantidade || 1 }];
    });
  };

  const updateCartItemQuantity = (nome_item: string, delta: number) => {
    setCartItems(prev => prev
      .map(i => i.nome_item === nome_item ? { ...i, quantidade: Math.max(0, i.quantidade + delta) } : i)
      .filter(i => i.quantidade > 0)
    );
  };

  const removeCartItem = (nome_item: string) => {
    setCartItems(prev => prev.filter(i => i.nome_item !== nome_item));
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => cartItems.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

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

  // Busca cliente específico
  const fetchClient = async (query: string): Promise<fetchClientResult> => {
    try {
      const response = await fetch(`${API_URL}/api/clients/fetchClient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({query})
      });
      console.log("query", query);
      if (!response.ok) {
          const ct = response.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const body = await response.json();
            const errorMessage = body.errorMessage || body.message || JSON.stringify(body);
            return { ok: false, status: response.status, statusText: response.statusText, errorMessage };
          } else {
            const text = await response.text();
            return { ok: false, status: response.status, statusText: response.statusText, errorMessage: text };
          }
        }

        const client = await response.json();
        setFoundClient(client)
        return { ok: true, client };

    } catch (error) {
        console.error('[OrdersProvider] POST /api/fetchClient error', error);
        return { ok: false, status: 0, statusText: 'NetworkError' };
    }
  }

  const loginClient = async (telefone: string): Promise<SignUpClientResult> => {
      try {
        const response = await fetch(`${API_URL}/api/loginClient`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telefone }),
        });

        if (!response.ok) {
          const ct = response.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const body = await response.json();
            const errorMessage = body.errorMessage || body.message || JSON.stringify(body);
            return { ok: false, status: response.status, statusText: response.statusText, errorMessage };
          } else {
            const text = await response.text();
            return { ok: false, status: response.status, statusText: response.statusText, errorMessage: text };
          }
        }

        const client: ClientType = await response.json();
        setCurrentClient(client);
        return { ok: true, client };
      } catch (error) {
        console.error('[OrdersProvider] POST /api/loginClient error', error);
        return { ok: false, status: 0, statusText: 'NetworkError' };
      }
    }

  const logoutClient = async () => {
    setCartItems([]);
    setCurrentClient(null);
  }

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
    allMenuItems,
    signUpClient,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    getCartTotal,
    createOrder,
    loginClient,
    logoutClient,
    currentClient,
    query, 
    setQuery,
    fetchClient,
    foundClient,
    isSignUpModalOpen,
    setIsSignUpModalOpen,
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