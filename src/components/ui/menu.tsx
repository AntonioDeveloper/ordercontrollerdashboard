import { IconPizza, IconUser } from "@tabler/icons-react";
import Link from "next/link";

export default function Menu () {
  return (
    <aside className="basis-1/6 flex-none h-dvh flex flex-col relative bg-slate-900">
      <h1 className="px-5 py-2 text-2xl font-bold text-white">Pizza Dash Menu</h1>

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
      
      <div className="absolute bottom-5 left-5 w-1/2">
        <button type="button" className="w-full text-center bg-[#ec4913] px-2 py-2 rounded-[8px] text-white">
          Novo Pedido
        </button>
      </div>
    </aside>
  )
}