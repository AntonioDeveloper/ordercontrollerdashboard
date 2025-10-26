'use client'

import ClientRow from "@/components/ui/clientRow";
import SignUpClientsModal from "@/components/ui/signUpClientsModal";
import { useOrders } from "@/context/context";
import { useState } from "react";

export default function Home() {

  const { allClients, signUpClient } = useOrders();
  const [isOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleSubmit = () => {
    const payload = {
      nome_cliente: nome,
      endereco: endereco,
      telefone: telefone,
    }
    signUpClient(payload);
  }

  return (
    <div className="w-full px-4 py-4">

      <div className="flex justify-between items-center mb-4.5">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <button className="bg-[#ec4913] text-white px-4 py-2 rounded-md cursor-pointer" onClick={() => setIsOpen(true)} >Adicionar Cliente</button>
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="w-full">
            <th className="w-1/12 border border-gray-300 px-4 py-2">ID</th>
            <th className="w-1/12 border border-gray-300 px-4 py-2">Nome</th>
            <th className="w-1/12 border border-gray-300 px-4 py-2">Endereço</th>
            <th className="w-1/12 border border-gray-300 px-4 py-2">Telefone</th>
            <th className="w-1/12 border border-gray-300 px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          <ClientRow clients={allClients} />
        </tbody>
      </table>
      
      <SignUpClientsModal open={isOpen} onClose={() => setIsOpen(false)}>
        <h1 className="text-2xl font-bold">Cadastrar Novo Cliente</h1>
        <form className="w-full flex flex-col items-center gap-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <input className="w-full h-12 px-4 border border-gray-300 rounded-md" type="text" placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
          <input className="w-full h-12 px-4 border border-gray-300 rounded-md" type="text" placeholder="Endereço" onChange={(e) => setEndereco(e.target.value)} />
          <input className="w-full h-12 px-4 border border-gray-300 rounded-md" type="text" placeholder="Telefone" onChange={(e) => setTelefone(e.target.value)} />
          <button className="w-full h-12 bg-[#ec4913] text-white px-4 py-2 rounded-md cursor-pointer" type="submit">Cadastrar</button>
        </form>
      </SignUpClientsModal>
    </div>
  );
}
