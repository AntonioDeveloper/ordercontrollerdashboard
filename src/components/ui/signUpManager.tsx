'use client'

import { useState, useEffect } from "react";
import { useOrders } from "@/context/context";
import SignUpClientsModal from "./signUpClientsModal";

export default function SignUpManager() {
  const { isSignUpModalOpen, setIsSignUpModalOpen, signUpClient } = useOrders();
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signUpDone, setSignUpDone] = useState(false);

  // Reset fields when modal opens
  useEffect(() => {
    if (isSignUpModalOpen) {
      setErrorMessage(null);
      setSignUpDone(false);
    }
  }, [isSignUpModalOpen]);

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
          setIsSignUpModalOpen(false);
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

  return (
    <SignUpClientsModal open={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-800">Cadastrar Novo Cliente</h2>
        
        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
            {errorMessage}
          </div>
        )}
        
        {signUpDone && (
          <div className="bg-green-50 text-green-600 p-3 rounded text-sm">
            Cliente cadastrado com sucesso!
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nome</label>
          <input 
            type="text" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:border-orange-500"
            placeholder="Nome completo"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Telefone</label>
          <input 
            type="text" 
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:border-orange-500"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Endereço</label>
          <input 
            type="text" 
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:border-orange-500"
            placeholder="Rua, Número, Bairro"
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isLoading || signUpDone}
          className={`mt-2 py-2 px-4 rounded font-bold text-white transition-colors ${
            isLoading || signUpDone ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ec4913] hover:bg-[#d14010]'
          }`}
        >
          {isLoading ? 'Cadastrando...' : signUpDone ? 'Sucesso!' : 'Cadastrar'}
        </button>
      </div>
    </SignUpClientsModal>
  );
}
