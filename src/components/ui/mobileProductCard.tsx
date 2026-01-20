'use client'

import Image from 'next/image';
import { IconShoppingCart } from '@tabler/icons-react';

interface MobileProductCardProps {
  name: string;
  description: string;
  price: number;
  imageSrc: string;
  onAdd: () => void;
}

export default function MobileProductCard({ name, description, price, imageSrc, onAdd }: MobileProductCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      {/* Image Container */}
      <div className="relative w-full h-40 mb-3 rounded-xl overflow-hidden">
        <Image 
          src={imageSrc} 
          alt={name} 
          fill 
          className="object-cover"
        />
      </div>
      
      {/* Title and Price Row */}
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight">{name}</h3>
        <span className="font-bold text-[#ec4913] text-lg whitespace-nowrap ml-2">
            R$ {price.toFixed(2).replace('.', ',')}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-xs mb-4 leading-relaxed line-clamp-2">
        {description}
      </p>
      
      {/* Add Button */}
      <button 
        onClick={onAdd}
        className="w-full bg-[#ec4913] hover:bg-[#d14010] active:bg-[#b03a0d] text-white font-bold py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <IconShoppingCart size={20} />
        Adicionar
      </button>
    </div>
  );
}
