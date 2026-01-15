'use client'

import { useState } from 'react';
import { useOrders } from '@/context/context';

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
      const resp = await fetch('http://localhost:3001/api/analyzeNutrition', {
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
    <div className="w-full h-auto p-4 border-t border-gray-100 bg-gray-50">
      <h2 className="text-sm font-bold text-gray-700 mb-2">Análise Nutricional</h2>
      
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

      {result && (
        <div className="text-xs space-y-2">
          <p className="font-semibold text-gray-800">Total: <span className="text-[#ec4913]">{result.totalCalorias} kcal</span></p>
          
          <div className="border-t border-gray-200 pt-2">
            <p className="font-semibold text-gray-700 mb-1">Detalhes:</p>
            <ul className="space-y-1 text-gray-600">
              {result.porItem.map((i) => (
                <li key={i.nome_item} className="flex justify-between">
                  <span>{i.quantidade}x {i.nome_item}</span>
                  <span>{i.kcalTotal} kcal</span>
                </li>
              ))}
            </ul>
          </div>

          {result.observacoes && (
             <div className="border-t border-gray-200 pt-2">
                <p className="font-semibold text-gray-700 mb-1">Observações:</p>
                <p className="text-gray-600 italic">
                  {result.observacoes}
                </p>
             </div>
          )}

          {(result.sugestoes.length > 0 || result.dicasSuavizar.length > 0) && (
             <div className="border-t border-gray-200 pt-2">
                <p className="font-semibold text-gray-700 mb-1">Dicas e Sugestões:</p>
                <ul className="list-disc list-inside text-gray-600">
                  {[...result.sugestoes, ...result.dicasSuavizar].map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
             </div>
          )}
        </div>
      )}
    </div>
  );
}