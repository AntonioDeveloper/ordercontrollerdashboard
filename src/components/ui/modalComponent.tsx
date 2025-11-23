'use client'
import { useEffect } from 'react'

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
        className="relative bg-white rounded p-4 shadow-lg w-[90vw] max-w-md"
      >
        <button className="absolute top-2 right-2 cursor-pointer" onClick={onClose}>Fechar</button>
        {children}
      </div>
    </div>
  );
}

