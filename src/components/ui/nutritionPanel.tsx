'use client'

import { useState } from 'react';
import { useOrders } from '@/context/context';
import { IconCheck, IconRefresh } from '@tabler/icons-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type NutritionResult = {
  totalCalorias: number;
  porItem: { nome_item: string; quantidade: number; kcalTotal: number }[];
  sugestoes: string[];
  dicasSuavizar: string[];
  observacoes: string;
};

export default function NutritionPanel() {
  const { cartItems } = useOrders();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [weight, setWeight] = useState<number>(70); // Peso padrão

  const analyze = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const resp = await fetch(`${API_URL}/api/analyzeNutrition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, userWeight: weight }),
      });
      if (!resp.ok) {
        const ct = resp.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const body = await resp.json();
          throw new Error(body.errorMessage || body.message || 'Falha na análise.');
        }
        const text = await resp.text();
        throw new Error(text || 'Falha na análise.');
      }
      const data: NutritionResult = await resp.json();
      setResult(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-1">
      <h2 className="text-sm font-bold text-gray-700 mb-2">Análise Nutricional</h2>
      
      {!result ? (
        <>
            <div className="flex items-center gap-2 mb-3">
                <label className="text-xs text-gray-600 whitespace-nowrap">Seu peso (kg):</label>
                <input 
                type="number" 
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                min="30"
                max="200"
                />
            </div>

            <button
                onClick={analyze}
                disabled={loading}
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors shadow-sm mb-3"
            >
                {loading ? 'Analisando...' : '🔍 Analisar Nutrição'}
            </button>

            {error && (
                <p className="text-xs text-red-600 mb-2">{error}</p>
            )}
        </>
      ) : (
        <div className="text-xs space-y-2 mt-1 overflow-y-auto pr-2 bg-white pb-4 h-full flex flex-col">
             <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                <span className="font-bold text-green-600 flex items-center gap-1">
                    <IconCheck size={16} /> Análise Pronta
                </span>
                <button 
                    onClick={() => setResult(null)} 
                    className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-[10px]"
                >
                    <IconRefresh size={12} /> Refazer
                </button>
            </div>

          <p className="font-semibold text-gray-800">Total: <span className="text-[#ec4913]">{result.totalCalorias} kcal</span></p>
          
          <div className="border-t border-gray-100 pt-2">
            <p className="font-semibold text-gray-700 mb-1">Detalhes:</p>
            <ul className="space-y-1 text-gray-600">
              {result.porItem.map((i) => (
                <li key={i.nome_item} className="flex justify-between items-center border-b border-gray-50 pb-1 last:border-0">
                  <span className="truncate pr-2">{i.quantidade}x {i.nome_item}</span>
                  <span className="whitespace-nowrap font-medium">{i.kcalTotal} kcal</span>
                </li>
              ))}
            </ul>
          </div>

          {result.observacoes && (
             <div className="border-t border-gray-100 pt-2">
                <p className="font-semibold text-gray-700 mb-1">Observações:</p>
                <p className="text-gray-600 italic leading-relaxed">
                  {result.observacoes}
                </p>
             </div>
          )}

          {(result.sugestoes.length > 0 || result.dicasSuavizar.length > 0) && (
             <div className="border-t border-gray-100 pt-2">
                <p className="font-semibold text-gray-700 mb-1">Dicas e Sugestões:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {[...result.sugestoes, ...result.dicasSuavizar].map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
             </div>
          )}
        </div>
      )}
    </div>
  );
}