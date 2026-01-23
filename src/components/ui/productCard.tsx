'use client'

import Image from 'next/image';

interface ProductCardProps {
  name: string;
  description: string;
  imageSrc: string;
  onAdd: () => void;
}

export default function ProductCard({ name, description, imageSrc, onAdd }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-gray-100">
      <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
        <Image 
          src={imageSrc} 
          alt={name} 
          fill 
          className="object-cover"
        />
      </div>
      
      <div className="flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {description}
        </p>
        
        {/* <p className="text-gray-900 font-bold mb-3">R$ {price.toFixed(2)}</p> */}
        
        <button 
          onClick={onAdd}
          className="w-full bg-[#ec4913] hover:bg-[#d14010] text-white font-bold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
