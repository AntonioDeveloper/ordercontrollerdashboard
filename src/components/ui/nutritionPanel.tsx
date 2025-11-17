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

  const analyze = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const resp = await fetch('http://localhost:3001/api/analyzeNutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems }),
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
    <div className="w-1/3 h-auto p-4 border border-zinc-300 rounded-[8px] ml-4">
      <h2 className="text-xl font-bold mb-2">Análise Nutricional</h2>
      <button
        onClick={analyze}
        disabled={loading}
        className="bg-[#ec4913] text-white px-3 py-2 rounded-md"
      >
        {loading ? 'Analisando...' : 'Analisar Nutrição'}
      </button>

      {error && (
        <p className="mt-3 text-red-600">{error}</p>
      )}

      {result && (
        <div className="mt-3">
          <p className="font-semibold">Total de calorias: {result.totalCalorias} kcal</p>
          <div className="mt-2">
            <p className="font-semibold">Por item:</p>
            <ul className="list-disc list-inside">
              {result.porItem.map((i) => (
                <li key={i.nome_item}>{i.nome_item} x{i.quantidade}: {i.kcalTotal} kcal</li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <p className="font-semibold">Sugestões:</p>
            <ul className="list-disc list-inside">
              {result.sugestoes.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <p className="font-semibold">Dicas de suavizar:</p>
            <ul className="list-disc list-inside">
              {result.dicasSuavizar.map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          </div>
          <p className="mt-2 text-zinc-700">{result.observacoes}</p>
        </div>
      )}
    </div>
  );
}