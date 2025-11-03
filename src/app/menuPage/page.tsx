'use client'

import SearchBar from "@/components/ui/searchBar";
import { useOrders } from "@/context/context";
import {useState} from "react";
import LoginClientModal from "@/components/ui/loginClientModal";

export default function MenuPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [telefone, setTelefone] = useState("");
  const {currentPath, allMenuItems, loginClient} = useOrders();

  const {salty_pizzas, sweet_pizzas, vegetarian_pizzas, beverages} = allMenuItems;

  console.log("All Menu Itens", salty_pizzas, sweet_pizzas, vegetarian_pizzas, beverages);

  let placeholderText = "";

  if (currentPath === '/menuPage') {
    placeholderText = "Buscar produto";
  }

  const handleSubmit = () => {
    const payload = {
      telefone: telefone,
    }
    loginClient(payload.telefone);
  }

  return (
    <section className="w-full h-full">
      <SearchBar placeholder={placeholderText} />

      <div className="w-full h-full bg-[#F5F5F5] grid grid-cols-2 gap-1 p-4">
      <button className="bg-[#ec4913] text-white px-4 py-2 rounded-md cursor-pointer" onClick={() => setIsOpen(true)} >Login</button>
      </div>

      <LoginClientModal open={isOpen} onClose={() => setIsOpen(false)}>
              <h1 className="text-2xl font-bold">Faça seu login!</h1>
              <form className="w-full flex flex-col items-center gap-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                
                <input className="w-full h-12 px-4 border border-gray-300 rounded-md" type="text" placeholder="Telefone" onChange={(e) => setTelefone(e.target.value)} />
                <button className="w-full h-12 bg-[#ec4913] text-white px-4 py-2 rounded-md cursor-pointer" type="submit">Login</button>
              </form>
            </LoginClientModal>
    </section>
  )
}