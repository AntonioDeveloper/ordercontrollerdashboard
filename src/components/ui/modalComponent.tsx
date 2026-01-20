'use client'
import { useEffect } from 'react'
import { IconX } from '@tabler/icons-react'

type LoginClientModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function ModalComponent({ open, onClose, children }: LoginClientModalProps) {

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-xl p-6 pt-12 shadow-lg w-[90vw] max-w-md animate-in fade-in zoom-in duration-200"
      >
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 z-10" 
          onClick={onClose}
          aria-label="Fechar"
        >
          <IconX size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

