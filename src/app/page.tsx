'use client'

import { useOrders } from "@/context/context";
import SearchBar from "@/components/ui/searchBar";
import ClientRow from "@/components/ui/clientRow";
import MobileClientCard from "@/components/ui/mobileClientCard";
import { useMemo, useState } from "react";
import { IconChevronLeft, IconChevronRight, IconPlus } from "@tabler/icons-react";

export default function Home() {
  const {
    allClients,
    fetchClient,
    setQuery,
    query,
    foundClient,
    setIsSignUpModalOpen,
    allOrders,
  } = useOrders();

  const list = useMemo(() => {
    if (query && foundClient) return [foundClient];
    return allClients;
  }, [allClients, foundClient, query]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const total = list.length;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = list.slice(start, end);
  const rangeLabel = `${total === 0 ? 0 : start + 1}-${Math.min(end, total)} de ${total} clientes`;

  const onSearch = async (value: string) => {
    setQuery(value);
    if (value && value.trim().length > 0) {
      await fetchClient(value.trim());
    }
  };

  return (
    <section className="w-full h-full p-4 flex flex-col">
      {/* Header Desktop */}
      <div className="hidden md:flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Board de Clientes Cadastrados</h1>
        <button
          className="bg-[#ec4913] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#d14010] transition-colors"
          onClick={() => setIsSignUpModalOpen(true)}
        >
          Adicionar Novo Cliente
        </button>
      </div>

      {/* Header Mobile */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Meus Clientes</h1>
        <button 
          onClick={() => setIsSignUpModalOpen(true)}
          className="bg-[#ec4913]/10 text-[#ec4913] p-2 rounded-lg"
        >
          <IconPlus size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <SearchBar placeholder="Buscar por nome do cliente..." onChange={(e) => onSearch(e.target.value)} />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full bg-white rounded-md border border-zinc-200 flex-1 overflow-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 w-1/12">ID</th>
              <th className="px-4 py-2 w-3/12">Nome</th>
              <th className="px-4 py-2 w-4/12">Endereço</th>
              <th className="px-4 py-2 w-3/12">Telefone</th>
              <th className="px-4 py-2 w-2/12">Total de Pedidos</th>
              <th className="px-4 py-2 w-1/12">Ações</th>
            </tr>
          </thead>
          <tbody>
            <ClientRow clients={pageItems} />
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="md:hidden flex-1 overflow-y-auto pb-20">
        {pageItems.map((client) => (
          <MobileClientCard key={client._id} client={client} allOrders={allOrders} />
        ))}
        {pageItems.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Nenhum cliente encontrado
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-between shrink-0">
        <p className="text-sm text-zinc-600">{rangeLabel}</p>
        <div className="flex items-center gap-2">
          <button
            aria-label="Página anterior"
            className="px-2 py-1 rounded-md border border-zinc-300 text-zinc-700 disabled:opacity-50 cursor-pointer bg-white"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <IconChevronLeft size={16} />
          </button>
          <button
            aria-label="Próxima página"
            className="px-2 py-1 rounded-md border border-zinc-300 text-zinc-700 disabled:opacity-50 cursor-pointer bg-white"
            onClick={() => setCurrentPage((p) => (end < total ? p + 1 : p))}
            disabled={end >= total}
          >
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
