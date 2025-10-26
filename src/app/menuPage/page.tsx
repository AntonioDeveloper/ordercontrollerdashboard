'use client'

import SearchBar from "@/components/ui/searchBar";
import { useOrders } from "@/context/context";

export default function MenuPage() {
  const {currentPath} = useOrders();
  let placeholderText = "";

  if (currentPath === '/menuPage') {
    placeholderText = "Buscar produto";
  }

  return (
    <section className="w-full h-full">
      <SearchBar placeholder={placeholderText} />
    </section>
  )
}