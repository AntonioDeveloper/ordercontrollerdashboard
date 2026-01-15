'use client'

import { useOrders } from "@/context/context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [telefone, setTelefone] = useState("");
  const { loginClient, currentClient, logoutClient } = useOrders();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Efeito para verificar login, se necessário
  }, [currentClient]);

  const mapLoginError = (status?: number, fallback?: string | null) => {
    switch (status) {
      case 400:
        return 'Telefone inválido. Informe um número válido.';
      case 404:
        return 'Cliente não encontrado. Verifique o telefone ou cadastre-se.';
      case 500:
        return 'Erro interno. Tente novamente mais tarde.';
      default:
        return fallback || 'Falha ao efetuar login.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!telefone.trim()) {
        setErrorMessage("Por favor, informe seu telefone.");
        setIsLoading(false);
        return;
      }

      const normalizedPhone = telefone.replace(/\D/g, '');
      if (!normalizedPhone) {
        setErrorMessage("Por favor, informe um telefone válido (apenas números).");
        setIsLoading(false);
        return;
      }

      const result = await loginClient(normalizedPhone);

      if (typeof result === 'object' && result && 'ok' in result && !result.ok) {
        setErrorMessage(mapLoginError(result.status, result.errorMessage));
      } else if (typeof result === 'string') {
          setErrorMessage(result);
      } else if (result === undefined) {
          setErrorMessage("Erro desconhecido ao tentar login.");
      } else {
        // Sucesso: não redireciona automaticamente
        // O estado currentClient será atualizado e o componente renderizará a tela de "Bem-vindo"
      }
    } catch (err) {
      setErrorMessage("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = async () => {
      await logoutClient();
      setTelefone("");
  }

  if (currentClient) {
      return (
        <section className="w-full h-full flex items-center justify-center bg-[#F5F5F5] p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo(a), {currentClient.nome_cliente}!</h1>
                <p className="text-gray-600 mb-6">Você já está logado.</p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => router.push('/saltyPizzasPage')}
                        className="w-full h-12 bg-[#ec4913] text-white font-semibold rounded-md hover:bg-[#d14010] transition-colors flex items-center justify-center"
                    >
                        Ir para o Cardápio
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="w-full h-12 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Sair / Trocar Conta
                    </button>
                </div>
            </div>
        </section>
      )
  }

  return (
    <section className="w-full h-full flex items-center justify-center bg-[#F5F5F5] p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#ec4913] mb-2">Login</h1>
            <p className="text-gray-500">Acesse para fazer seu pedido</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
            </label>
            <input
              id="telefone"
              type="tel"
              placeholder="Digite seu telefone com DDD (apenas números)"
              className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec4913] focus:border-transparent transition-all"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
                {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#ec4913] text-white font-bold rounded-md hover:bg-[#d14010] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mt-2"
          >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                </span>
            ) : (
                "ENTRAR"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
            Ainda não tem cadastro? <span className="text-[#ec4913] font-semibold cursor-pointer" onClick={() => alert("Por favor, solicite o cadastro ao balcão.")}>Fale com o atendente</span>
        </div>
      </div>
    </section>
  )
}
