import { MinicartItem } from "@/model/minicart";

interface MinicartProps {
  items?: MinicartItem[];
  setItems?: (items: MinicartItem[]) => void;
}

export default function Minicart ({ items = [], setItems }: MinicartProps) {

  return (
    <div className="w-1/3 h-full flex flex-col items-center gap-0.5">
      <h2 className="text-zinc-600 text-2xl font-bold text-center">Resumo do pedido</h2>

      <ul className="w-full h-auto flex flex-col items-center gap-0.5">
        {items.map(item => (
          <li key={item.nome_item} className="w-full h-12 flex items-center justify-between px-2 bg-zinc-100 rounded-[8px]">
            <p className="text-zinc-600 text-sm font-bold">{item.nome_item}</p>
            <button className="w-8 h-8 text-center text-zinc-600 text-sm font-bold cursor-pointer" onClick={() => setItems?.(items.map(i => i.nome_item === item.nome_item && i.quantidade > 0 ? { ...i, quantidade: i.quantidade - 1 } : i))}>
              -
            </button>
            <input className="w-8 h-8 text-center text-zinc-600 text-sm font-bold" type="text" inputMode="numeric"
            pattern="[0-9]*" value={item.quantidade} readOnly />
            <button className="w-8 h-8 text-center text-zinc-600 text-sm font-bold cursor-pointer" onClick={() => setItems?.(items.map(i => i.nome_item === item.nome_item ? { ...i, quantidade: i.quantidade + 1 } : i))}>
              +
            </button>
          </li>
        ))}
      </ul>
      <div className="w-full h-12 flex items-center justify-between px-2 bg-zinc-100 rounded-[8px]">
        <p className="text-zinc-600 text-sm font-bold">Total</p>
        <p className="text-zinc-600 text-sm font-bold">R$ {items.reduce((acc, item) => acc + item.preco * item.quantidade, 0).toFixed(2)}</p>
      </div>
    </div>
  )
}