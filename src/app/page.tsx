'use client'

import { useOrders } from "@/context/context";
import SearchBar from "@/components/ui/searchBar";
import ClientRow from "@/components/ui/clientRow";
import SignUpClientsModal from "@/components/ui/signUpClientsModal";
import { useEffect, useMemo, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export default function Home() {
  const {
    allClients,
    fetchClient,
    setQuery,
    query,
    foundClient,
    signUpClient,
  } = useOrders();

  const [isOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signUpDone, setSignUpDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleSubmit = async () => {
    const payload = { nome_cliente: nome, endereco, telefone };
    try {
      setIsLoading(true);
      const result = await signUpClient(payload);
      if (typeof result === 'object' && result && !result.ok) {
        setErrorMessage(result.errorMessage ?? null);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setSignUpDone(true);
        setErrorMessage(null);
        setTimeout(() => {
          setIsOpen(false);
          setSignUpDone(false);
          setNome("");
          setEndereco("");
          setTelefone("");
        }, 3000);
      }
    } catch {
      setErrorMessage("Ocorreu um erro inesperado");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setErrorMessage(null);
  }, [isOpen]);

  return (
    <section className="w-full h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Board de Clientes Cadastrados</h1>
        <button
          className="bg-[#ec4913] text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Adicionar Novo Cliente
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <SearchBar placeholder="Buscar por nome do cliente..." onChange={(e) => onSearch(e.target.value)} />
      </div>

      <div className="w-full bg-white rounded-md border border-zinc-200">
        <table className="w-full text-left">
          <thead className="bg-zinc-50">
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

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-zinc-600">{rangeLabel}</p>
        <div className="flex items-center gap-2">
          <button
            aria-label="Página anterior"
            className="px-2 py-1 rounded-md border border-zinc-300 text-zinc-700 disabled:opacity-50 cursor-pointer"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <IconChevronLeft size={16} />
          </button>
          <button
            aria-label="Próxima página"
            className="px-2 py-1 rounded-md border border-zinc-300 text-zinc-700 disabled:opacity-50 cursor-pointer"
            onClick={() => setCurrentPage((p) => (end < total ? p + 1 : p))}
            disabled={end >= total}
          >
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>

      <SignUpClientsModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setErrorMessage(null);
          setSignUpDone(false);
        }}
      >
        {errorMessage === null ? (
          <>
            <h1 className="text-2xl font-bold">Cadastrar Novo Cliente</h1>
            <form
              className="w-full flex flex-col items-center gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <input
                className="w-full h-12 px-4 border border-gray-300 rounded-md"
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <input
                className="w-full h-12 px-4 border border-gray-300 rounded-md"
                type="text"
                placeholder="Endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
              <input
                className="w-full h-12 px-4 border border-gray-300 rounded-md"
                type="text"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <button
                className="w-full h-12 bg-[#ec4913] text-white px-4 py-2 rounded-md cursor-pointer"
                type="submit"
              >
                {signUpDone === false ? "Cadastrar" : "Cadastro realizado!"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-red-500 font-semibold">Falha no Cadastro</h1>
            <p className="text-zinc-700">{errorMessage || ""}</p>
          </>
        )}
      </SignUpClientsModal>
    </section>
  );
}
