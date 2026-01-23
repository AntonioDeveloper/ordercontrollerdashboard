'use client'

import { ClientType } from "@/model/clientType";
import { useState, useEffect } from "react";
import { useOrders } from "@/context/context";
import { OrderType } from "@/model/orderType";

interface ClientRowProps {
  clients: ClientType[];
}

export default function ClientRow({ clients }: ClientRowProps) {
  // Edita somente a linha clicada
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newData, setNewData] = useState<ClientType>({
    _id: "",
    nome_cliente: "",
    endereco: "",
    telefone: "",
  });

  const { updateClientData, foundClient, query, allOrders } = useOrders();

  const handleSave = async (id: string) => {
    setNewData({
      ...newData,
      _id: id,
      nome_cliente: (document.querySelector(`input[name="nome_cliente"]`) as HTMLInputElement)?.value || "",
      endereco: (document.querySelector(`input[name="endereco"]`) as HTMLInputElement)?.value || "",
      telefone: (document.querySelector(`input[name="telefone"]`) as HTMLInputElement)?.value || "",
    });
  };

  
  useEffect(() => {
    async function runUpdateClient () {
      if (!newData._id) return;
      await updateClientData(newData._id, newData);
      setEditingId(null);
    }
    runUpdateClient();
  }, [newData, updateClientData]);
 
  const singleClientArray: ClientType[] = [];
  if (query && foundClient) singleClientArray.push(foundClient);

  const clientLinesArray: ClientType[] = singleClientArray.length == 1 ? singleClientArray : clients;
  
  console.log("foundClient", singleClientArray, query, foundClient);   

  return (
    <>
      {clientLinesArray.map((client: ClientType) => {
        const isEditing = editingId === client._id;
        return (
          <tr key={client._id} className="w-full">
            <td className="w-1/12 border border-gray-300 px-4 py-2">{client._id}</td>
            <td className="w-1/12 border border-gray-300 px-4 py-2">
              {isEditing ? (
                <input
                  name="nome_cliente"
                  type="text"
                  placeholder="Digite o nome do cliente"
                  className="w-full border px-2 py-1 rounded"
                />
              ) : (
                client.nome_cliente
              )}
            </td>
            <td className="w-1/12 border border-gray-300 px-4 py-2">{isEditing ? (
                <input
                  name="endereco"
                  type="text"
                  placeholder="Digite o endereço do cliente"
                  className="w-full border px-2 py-1 rounded"
                />
              ) : (
                client.endereco
              )}</td>
            <td className="w-1/12 border border-gray-300 px-4 py-2">{isEditing ? (
                <input
                  name="telefone"
                  type="text"
                  placeholder="Digite o telefone do cliente"
                  className="w-full border px-2 py-1 rounded"
                />
              ) : (
                client.telefone
              )}</td>
            <td className="w-1/12 border border-gray-300 px-4 py-2">
              {allOrders.filter((o: OrderType) => o.nome_cliente === client.nome_cliente).length}
            </td>
            <td className="w-1/12 border border-gray-300 px-4 py-2">
              <button
                className="cursor-pointer bg-[#ec4913] text-white px-3 py-1 rounded"
                onClick={() => {
                  if (isEditing) {
                    // Finaliza edição desta linha
                    handleSave(client._id);
                  } else {
                    // Inicia edição desta linha com o nome atual
                    setEditingId(client._id);
                  }
                }}
              >
                {isEditing ? "Concluir" : "Editar"}
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
}
