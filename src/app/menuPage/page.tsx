'use client'

import SearchBar from "@/components/ui/searchBar";
import { useOrders } from "@/context/context";

export default function MenuPage() {
  const {currentPath, allMenuItems} = useOrders();

  const {salty_pizzas, sweet_pizzas, vegetarian_pizzas, beverages} = allMenuItems;

  console.log("All Menu Itens", salty_pizzas, sweet_pizzas, vegetarian_pizzas, beverages);

  let placeholderText = "";

  if (currentPath === '/menuPage') {
    placeholderText = "Buscar produto";
  }

  return (
    <section className="w-full h-full">
      <SearchBar placeholder={placeholderText} />

      <div className="w-full h-full bg-[#F5F5F5] grid grid-cols-2 gap-1 p-4">

      </div>
    </section>
  )
}