'use server';

type CartItem = {
  nome_item: string;
  quantidade: number;
  tamanho?: string;
};

type NutritionResult = {
  totalCalorias: number;
  porItem: { nome_item: string; quantidade: number; kcalTotal: number }[];
  sugestoes: string[];
  dicasSuavizar: string[];
  observacoes: string;
  source: 'ai';
};

type LocalBaseline = {
  totalCalorias: number;
  porItem: { nome_item: string; quantidade: number; kcalTotal: number }[];
};

const LIGHT_KCAL_THRESHOLD = Number(
  process.env.LIGHT_ORDER_KCAL_THRESHOLD ?? '30'
);

function buildPrompt(cartItems: CartItem[], baseline?: LocalBaseline): string {
  const schema = `{
    "totalCalorias": number,
    "porItem": [{ "nome_item": string, "quantidade": number, "kcalTotal": number }],
    "sugestoes": string[],
    "dicasSuavizar": string[],
    "observacoes": string,
    "source": "ai"
  }`;

  return [
    'Você é um assistente nutricional. Responda SOMENTE com JSON válido. Leve em conta o que está sendo pedido para elaborar suas respostas',
    'Formato obrigatório do JSON (campo e tipo exatos):',
    schema,
    'Regras:',
    '- Não inclua texto fora do JSON, sem comentários ou explicações.',
    '- Gere seus próprios valores de calorias. Se necessário, estime de forma conservadora.',
    '- Use o campo "source" com valor fixo "ai".',
    `- Para pedidos calóricos: inclua pelo menos 3 atividades físicas acessíveis (caminhada leve, alongamentos, subir escadas), de baixo impacto, sem custo e sem equipamentos, com duração entre 10 e 30 minutos.`,
    `- Para pedidos leves (ex.: água/bebidas 0 kcal) ou quando o total for ≤ ${LIGHT_KCAL_THRESHOLD} kcal: NÃO proponha controle de danos e retorne "dicasSuavizar": [].`,
    '- Oriente iniciantes: começar devagar e consultar médico para adoção de rotina mais regular quando necessário.',
    'Carrinho:',
    JSON.stringify(cartItems, null, 2),
    baseline
      ? 'Referência de calorias (apenas para contexto, não copie):\n' +
        JSON.stringify(baseline, null, 2)
      : '',
  ].join('\n');
}

function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every((x) => typeof x === 'string');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateNutritionResult(obj: any): obj is NutritionResult {
  if (typeof obj !== 'object' || obj === null) return false;
  const {
    totalCalorias,
    porItem,
    sugestoes,
    dicasSuavizar,
    observacoes,
    source,
  } = obj;
  if (typeof totalCalorias !== 'number') return false;
  if (!Array.isArray(porItem)) return false;
  for (const it of porItem) {
    if (
      typeof it?.nome_item !== 'string' ||
      typeof it?.quantidade !== 'number' ||
      typeof it?.kcalTotal !== 'number'
    ) {
      return false;
    }
  }
  if (!isStringArray(sugestoes)) return false;
  if (!isStringArray(dicasSuavizar)) return false;
  if (typeof observacoes !== 'string') return false;
  if (source !== 'ai') return false;
  return true;
}

export async function analyzeWithAI(
  cartItems: CartItem[],
  baseline?: LocalBaseline
): Promise<NutritionResult> {
  if (!Array.isArray(cartItems)) {
    throw new Error('Parâmetro cartItems inválido: deve ser um array');
  }
  const provider = process.env.AI_PROVIDER ?? 'groq';

  // Montar prompt estruturado
  const prompt = buildPrompt(cartItems, baseline);

  if (provider === 'groq') {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY ausente no ambiente');
    }
    const model = process.env.GROQ_MODEL ?? 'openai/gpt-oss-120b';

    const body = {
      model,
      messages: [
        { role: 'system', content: 'Responda estritamente em JSON válido.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.0,
    };

    const resp = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(
        `Groq API falhou: ${resp.status} ${resp.statusText} ${text}`
      );
    }

    const data = await resp.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;

    if (typeof content !== 'string' || content.trim().length === 0) {
      throw new Error('Resposta da IA vazia ou não textual');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      const start = content.indexOf('{');
      const end = content.lastIndexOf('}');
      if (start >= 0 && end > start) {
        const maybeJson = content.slice(start, end + 1);
        parsed = JSON.parse(maybeJson);
      } else {
        throw new Error('Falha ao parsear JSON retornado pela IA');
      }
    }

    // Garantir source
    if (parsed?.source !== 'ai') parsed.source = 'ai';
    if (!validateNutritionResult(parsed)) {
      throw new Error('JSON retornado pela IA fora do esquema esperado');
    }
    // Se pedido leve, suprimir controle de dano
    if (
      typeof parsed.totalCalorias === 'number' &&
      parsed.totalCalorias <= LIGHT_KCAL_THRESHOLD
    ) {
      parsed.dicasSuavizar = [];
    }
    return parsed as NutritionResult;
  }

  throw new Error(`AI provider não suportado: ${provider}`);
}
