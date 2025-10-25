'use client'

import { IconPizza, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import {useEffect, useState} from 'react';
import { usePathname } from "next/navigation";

export default function Menu () {

  const pathname = usePathname();

  const [menuPage, setMenuPage] = useState(false);

  useEffect(() => {
    if (pathname === '/menuPage') {
      setMenuPage(true);
    } else {
      setMenuPage(false);
    }
  }, [pathname]);

  return (
    <aside className="basis-1/6 flex-none h-dvh flex flex-col relative bg-slate-900">
      <h1 className="px-5 py-2 text-2xl font-bold text-white">Pizza Dash Menu</h1>

      {
        menuPage === false
        ?
        (
          <ul className="w-full mt-5 px-5 py-2">
                <li className="py-1.5">
                  <Link href="/" className="w-full flex items-center text-white">
                    <IconUser stroke={2} className="mr-2" />
                    Clientes
                  </Link>
                </li>
                <li className="py-1.5">
                  <Link href="/ordersPage" className="w-full flex items-center text-white">
                    <IconPizza stroke={2} className="mr-2"/>
                    Pedidos
                  </Link>
                </li>
              </ul>
        )
        :
        (
          <ul className="w-full mt-5 px-5 py-2">
                <li className="py-1.5">
                  <Link href="#" className="w-full flex items-center text-white">
                    <IconUser stroke={2} className="mr-2" />
                    Pizza Salgada
                  </Link>
                </li>
                <li className="py-1.5">
                  <Link href="/ordersPage" className="w-full flex items-center text-white">
                    <IconPizza stroke={2} className="mr-2"/>
                    Pizza Doce
                  </Link>
                </li>
                <li className="py-1.5">
                  <Link href="/ordersPage" className="w-full flex items-center text-white">
                    <IconPizza stroke={2} className="mr-2"/>
                    Bebidas
                  </Link>
                </li>
              </ul>
        )
      }
      
      {
        menuPage === false
        ?
        (<div className="absolute bottom-5 left-5 w-1/2">
        <Link href="/menuPage" className="w-full text-center bg-[#ec4913] px-2 py-2 rounded-[8px] text-white">
          Novo Pedido
        </Link>
      </div>)
        :
        (
          <div className="absolute bottom-5 left-5 w-1/2">
            <Link href="/" className="w-full text-center bg-[#ec4913] px-2 py-2 rounded-[8px] text-white">
              Voltar
            </Link>
          </div>
        )
      }
    </aside>
  )
}