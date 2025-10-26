'use client'

import { ClientType } from "@/model/clientType";
import { useState, useEffect } from "react";
import { useOrders } from "@/context/context";

interface ClientRowProps {
  clients: ClientType[];
}

export default function ClientRow({ clients }: ClientRowProps) {
  // Edita somente a linha clicada
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [newData, setNewData] = useState<ClientType>({
    _id: "",
    nome_cliente: "",
    endereco: "",
    telefone: "",
  });

  const { updateClientData } = useOrders();

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
      setEditingName("");
    }
    runUpdateClient();
    console.log("newData", newData);
  }, [newData]);

  return (
    <>
      {clients.map((client: ClientType) => {
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
                  onChange={(e) => setEditingName(e.target.value)}
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
                  onChange={(e) => setEditingName(e.target.value)}
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
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              ) : (
                client.telefone
              )}</td>
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
                    setEditingName(client.nome_cliente);
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