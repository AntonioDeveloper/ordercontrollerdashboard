'use client'
// Menu para mobile
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconUsers, IconPizza } from "@tabler/icons-react";

export default function BottomMenu() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-full h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-40 shrink-0">
      <Link href="/ordersPage" className={`flex flex-col items-center gap-1 p-2 ${isActive('/ordersPage') ? 'text-[#ec4913]' : 'text-gray-400'}`}>
        <IconPizza size={24} stroke={isActive('/ordersPage') ? 2 : 1.5} />
        <span className="text-[10px] font-medium">PEDIDOS</span>
      </Link>
      
      <Link href="/" className={`flex flex-col items-center gap-1 p-2 ${isActive('/') ? 'text-[#ec4913]' : 'text-gray-400'}`}>
        <IconUsers size={24} stroke={isActive('/') ? 2 : 1.5} />
        <span className="text-[10px] font-medium">CLIENTES</span>
      </Link>
    </div>
  );
}
