'use client'

import SearchBar from "@/components/ui/searchBar";
import { useOrders } from "@/context/context";
import {useState} from "react";
import LoginClientModal from "@/components/ui/loginClientModal";

export default function MenuPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [telefone, setTelefone] = useState("");
  const {currentPath, allMenuItems, loginClient, currentClient} = useOrders();
  const [loginFinished, setLoginFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState<boolean>(false);

  const {salty_pizzas, sweet_pizzas, vegetarian_pizzas, beverages} = allMenuItems;

  console.log("All Menu Itens", salty_pizzas, sweet_pizzas, vegetarian_pizzas, beverages);

  let placeholderText = "";

  if (currentPath === '/menuPage') {
    placeholderText = "Buscar produto";
  }

  const mapLoginError = (status?: number, fallback?: string | null) => {
    switch (status) {
      case 400:
        return 'Telefone inválido. Informe um número válido.';
      case 404:
        return 'Cliente não encontrado. Verifique o telefone.';
      case 500:
        return 'Erro interno. Tente novamente mais tarde.';
      default:
        return fallback || 'Falha ao efetuar login.';
    }
  };

  const handleSubmit = async () => {
    const payload = {
      telefone: telefone,
    }
    
    try {
      setIsLoading(true);
      const result = await loginClient(payload.telefone);
      console.log("OK", result);

      if (typeof result === 'object' && result && !result.ok) {
        setErrorMessage(mapLoginError(result.status, result.errorMessage ?? null));
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setLoginFinished(true);
        setErrorMessage(null);
        setTimeout(() => {
          setIsOpen(false);
        }, 4000);
      }
    } catch (err) {
      setErrorMessage("Ocorreu um erro inesperado");
      setIsLoading(false)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="w-full h-full">
    
      <div className="w-full h-full bg-[#F5F5F5] grid grid-cols-2 gap-1 p-4">
      <button className="bg-[#ec4913] text-white px-4 py-2 rounded-md cursor-pointer" onClick={() => setIsOpen(true)} >Login</button>
      </div>

      <LoginClientModal open={isOpen} onClose={() => {setIsOpen(false); setErrorMessage(null)}} >
              <h1 className="text-2xl font-bold">Faça seu login!</h1>
              <>
                <form className="w-full flex flex-col items-center gap-4" onSubmit={(e) => { e.preventDefault(); handleSubmit();}}>
                  { errorMessage === undefined 
                  ? 
                  (<><input className="w-full h-12 px-4 border border-gray-300 rounded-md" type="text" placeholder="Telefone" onChange={(e) => setTelefone(e.target.value)} /><button className="w-full h-12 bg-[#ec4913] text-white px-4 py-2 rounded-md cursor-pointer" type="submit">Login</button></>)
                  : errorMessage === null 
                  ? 
                  (<><p className="text-green-600 mt-2">Login realizado.</p></>)
                  :
                  (<><input className="w-full h-12 px-4 border border-gray-300 rounded-md" type="text" placeholder="Telefone" onChange={(e) => setTelefone(e.target.value)} /><h1 className="text-red-500 font-semibold">O login falhou: {errorMessage}</h1>     <button className="w-full h-12 bg-[#ec4913] text-white px-4 py-2 rounded-md cursor-pointer" type="submit">Tentar novamente</button></>) }
                
                </form>
              </>
            </LoginClientModal>
    </section>
  )
}