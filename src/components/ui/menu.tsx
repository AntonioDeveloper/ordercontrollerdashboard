'use client'

import { useOrders } from "@/context/context";
import { IconPizza, IconUser, IconGlassCocktail  } from "@tabler/icons-react";
import Link from "next/link";
import {useEffect} from 'react';


export default function Menu () {

 const {getPathName, menuPage} = useOrders();

  useEffect(() => {
    getPathName();
  }, [getPathName, menuPage]);

  return (
    <aside className="w-1/6 h-full flex flex-col relative bg-white border-r border-gray-100">
      <h1 className="px-5 py-6 text-2xl font-bold text-gray-800">Pizza Dash Menu</h1>

      {
        menuPage === false
        ?
        (
          <ul className="w-full mt-5 px-5 py-2 space-y-2">
                <li className="py-1.5">
                  <Link href="/" className="w-full flex items-center text-gray-600 hover:text-[#ec4913] transition-colors font-medium">
                    <IconUser stroke={2} className="mr-3" />
                    Clientes
                  </Link>
                </li>
                <li className="py-1.5">
                  <Link href="/ordersPage" className="w-full flex items-center text-gray-600 hover:text-[#ec4913] transition-colors font-medium">
                    <IconPizza stroke={2} className="mr-3"/>
                    Pedidos
                  </Link>
                </li>
              </ul>
        )
        :
        (
          <ul className="w-full mt-5 px-5 py-2 space-y-2">
                <li className="py-1.5">
                  <Link href="/saltyPizzasPage" className="w-full flex items-center text-gray-600 hover:text-[#ec4913] transition-colors font-medium">
                    <IconPizza stroke={2} className="mr-3" />
                    Pizza Salgada
                  </Link>
                </li>
                <li className="py-1.5">
                  <Link href="/sweetPizzasPage" className="w-full flex items-center text-gray-600 hover:text-[#ec4913] transition-colors font-medium">
                    <IconPizza stroke={2} className="mr-3"/>
                    Pizza Doce
                  </Link>
                </li>
                <li className="py-1.5">
                  <Link href="/beveragesPage" className="w-full flex items-center text-gray-600 hover:text-[#ec4913] transition-colors font-medium">
                    <IconGlassCocktail  stroke={2} className="mr-3"/>
                    Bebidas
                  </Link>
                </li>
              </ul>
        )
      }
      
      {
        menuPage === false
        ?
        (<div className="absolute bottom-5 left-5 right-5">
        <Link href="/loginPage" className="w-full block text-center bg-[#ec4913] hover:bg-[#d14010] px-4 py-3 rounded-xl text-white font-bold transition-colors shadow-lg shadow-orange-200">
          Novo Pedido
        </Link>
      </div>)
        :
        (
          <div className="absolute bottom-5 left-5 right-5">
            <Link href="/" className="w-full block text-center bg-[#ec4913] hover:bg-[#d14010] px-4 py-3 rounded-xl text-white font-bold transition-colors shadow-lg shadow-orange-200">
              Voltar
            </Link>
          </div>
        )
      }
    </aside>
  )
}
