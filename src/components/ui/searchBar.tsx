'use client'

import { IconSearch } from "@tabler/icons-react";

interface SearchBarProps {
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({placeholder, onChange}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconSearch className="h-5 w-5 text-gray-400" />
      </div>
      <input 
        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec4913] focus:border-transparent shadow-sm transition-all" 
        type="text" 
        placeholder={placeholder} 
        onChange={onChange}
      />
    </div>
  )
}
