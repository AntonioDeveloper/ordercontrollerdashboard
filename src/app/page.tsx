'use client'

import ClientRow from "@/components/ui/clientRow";
import { useOrders } from "@/context/context";

export default function Home() {

  const { allClients } = useOrders();
  console.log("allClients", allClients);

  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold">Clientes</h1>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="w-full">
            <th className="w-1/12 border border-gray-300 px-4 py-2">ID</th>
            <th className="w-1/12 border border-gray-300 px-4 py-2">Nome</th>
            <th className="w-1/12 border border-gray-300 px-4 py-2">Endereço</th>
            <th className="w-1/12 border border-gray-300 px-4 py-2">Telefone</th>
            <th className="w-1/12 border border-gray-300 px-4 py-2">Email</th>
            <th className="w-1/12 border border-gray-300 px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          <ClientRow clients={allClients} />
        </tbody>
      </table>
      

    </div>
  );
}
