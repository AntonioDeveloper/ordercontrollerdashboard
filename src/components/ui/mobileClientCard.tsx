'use client'

import { ClientType } from "@/model/clientType";
import { OrderType } from "@/model/orderType";
import { IconMapPin, IconPencil, IconTrophy } from "@tabler/icons-react";
import { useState } from "react";
import { useOrders } from "@/context/context";

interface MobileClientCardProps {
  client: ClientType;
  allOrders: OrderType[];
}

export default function MobileClientCard({ client, allOrders }: MobileClientCardProps) {
  const { updateClientData } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState({ ...client });

  const orderCount = allOrders.filter((o) => o.nome_cliente === client.nome_cliente).length;

  const handleSave = async () => {
    if (!editedClient._id) return;
    await updateClientData(editedClient._id, editedClient);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3 relative">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          {isEditing ? (
            <input
              className="w-full text-lg font-bold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-orange-500 mb-1"
              value={editedClient.nome_cliente}
              onChange={(e) => setEditedClient({ ...editedClient, nome_cliente: e.target.value })}
              placeholder="Nome do cliente"
            />
          ) : (
            <h3 className="text-lg font-bold text-gray-800">{client.nome_cliente}</h3>
          )}
          
          {isEditing ? (
             <input
             className="w-full text-sm font-medium text-[#ec4913] border-b border-gray-300 focus:outline-none focus:border-orange-500 mb-1"
             value={editedClient.telefone}
             onChange={(e) => setEditedClient({ ...editedClient, telefone: e.target.value })}
             placeholder="Telefone"
           />
          ) : (
            <p className="text-sm font-medium text-[#ec4913]">{client.telefone}</p>
          )}
        </div>
        
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-1 bg-orange-50 text-[#ec4913] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-orange-100 transition-colors"
        >
          {isEditing ? (
            <span>SALVAR</span>
          ) : (
            <>
              <IconPencil size={14} />
              EDITAR
            </>
          )}
        </button>
      </div>

      <div className="flex items-start gap-2 text-gray-500 text-xs mb-4">
        <IconMapPin size={14} className="mt-0.5 shrink-0" />
        {isEditing ? (
             <input
             className="w-full text-xs text-gray-500 border-b border-gray-300 focus:outline-none focus:border-orange-500"
             value={editedClient.endereco}
             onChange={(e) => setEditedClient({ ...editedClient, endereco: e.target.value })}
             placeholder="Endereço"
           />
          ) : (
            <p className="leading-tight">{client.endereco}</p>
          )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-[10px] text-gray-400 font-mono uppercase truncate max-w-[100px]">
          ID: {client._id}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <IconTrophy size={14} className="text-gray-400" />
          {orderCount} {orderCount === 1 ? 'pedido' : 'pedidos'}
        </div>
      </div>
    </div>
  );
}
