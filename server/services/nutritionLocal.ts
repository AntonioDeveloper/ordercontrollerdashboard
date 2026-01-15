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
  source: 'local';
};

export function analyzeLocally(
  cartItems: CartItem[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuDoc: any
): NutritionResult {
  const pizzasSalgadas = menuDoc?.pizzas_salgadas ?? [];
  const pizzasDoces = menuDoc?.pizzas_doces ?? [];
  const pizzasVegetarianas = menuDoc?.pizzas_vegetarianas ?? [];
  const bebidas = menuDoc?.bebidas ?? [];

  const findItemCal = (
    nome: string,
    tamanho?: string
  ): { kcalPerUnit: number; category: 'pizza' | 'beverage' | 'unknown' } => {
    const findPizza = (arr: typeof pizzasSalgadas) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      arr.find((i: any) => i.nome === nome);
    const ps =
      findPizza(pizzasSalgadas) ||
      findPizza(pizzasDoces) ||
      findPizza(pizzasVegetarianas);
    if (ps) {
      // Ajuste por tamanho: aproximação de fatias por pizza
      const slicesMap: Record<string, number> = {
        Grande: 12,
        Média: 8,
        Media: 8,
        Pequena: 6,
      };
      const defaultSlices = 8;
      const slices = tamanho
        ? slicesMap[tamanho] ?? defaultSlices
        : defaultSlices;
      const calPorFatia = ps.calorias_por_fatia_estimada;
      const kcalPerUnit = calPorFatia != null ? calPorFatia * slices : 800;
      return { kcalPerUnit, category: 'pizza' };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bev = bebidas.find((i: any) => i.nome === nome);
    if (bev) {
      const calInformada = bev.calorias_por_fatia_estimada;
      const kcalPerUnit =
        calInformada != null
          ? calInformada
          : fallbackBeverageCalories(bev.nome);
      return { kcalPerUnit, category: 'beverage' };
    }
    return { kcalPerUnit: 250, category: 'unknown' };
  };

  function fallbackBeverageCalories(nomeBebida: string): number {
    const n = nomeBebida.toLowerCase();
    // Água (com ou sem gás) deve ser 0 kcal
    if (/agua|água/.test(n)) return 0;
    if (/sem gás|com gás/.test(n) && /agua|água/.test(n)) return 0;
    // Refrigerantes zero/diet/light geralmente ~0 kcal
    if (/zero|diet|light/.test(n)) return 0;
    // Sucos
    if (/suco/.test(n)) return 110;
    // Refrigerantes comuns
    if (/refrigerante|cola|guaraná|lima|limão/.test(n)) return 150;
    // Cerveja
    if (/cerveja|beer|chopp/.test(n)) return 150;
    // Energético
    if (/energético|energy/.test(n)) return 110;
    // Café/Chá sem açúcar
    if (/cafe|café|chá/.test(n)) return 5;
    // Padrão genérico
    return 150;
  }

  const porItem = cartItems.map((ci) => {
    const { kcalPerUnit } = findItemCal(ci.nome_item, ci.tamanho);
    const kcalTotal = Math.round(kcalPerUnit * (ci.quantidade || 1));
    return {
      nome_item: ci.nome_item,
      quantidade: ci.quantidade || 1,
      kcalTotal,
    };
  });

  const totalCalorias = porItem.reduce((acc, i) => acc + i.kcalTotal, 0);

  const sugestoes: string[] = [];
  if (totalCalorias > 1200) {
    sugestoes.push('Reduzir a quantidade de pizzas em 1 unidade.');
  }
  const vegetarianaMaisLeve = [...pizzasVegetarianas].sort(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a: any, b: any) =>
      (a.calorias_por_fatia_estimada ?? 0) -
      (b.calorias_por_fatia_estimada ?? 0)
  )[0];
  if (vegetarianaMaisLeve) {
    sugestoes.push(
      `Trocar por pizza vegetariana (${vegetarianaMaisLeve.nome}) para reduzir calorias.`
    );
  }
  const agua = bebidas.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (b: any) =>
      /agua/i.test(b.nome) || (b.calorias_por_fatia_estimada ?? 0) === 0
  );
  const possuiBebidaCalorica = cartItems.some((ci) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = bebidas.find((b: any) => b.nome === ci.nome_item);
    return !!item && (item.calorias_por_fatia_estimada ?? 0) > 0;
  });
  if (agua && possuiBebidaCalorica) {
    sugestoes.push('Trocar bebida por Água para zerar calorias da bebida.');
  }

  const dicasSuavizar: string[] = [
    'Beber água antes e durante a refeição.',
    'Fazer caminhada leve de 30 minutos.',
    'Evitar sobremesa hoje ou optar por versão zero.',
    'Adicionar salada/legumes no dia para compensar.',
  ];

  const observacoes =
    totalCalorias > 1200
      ? 'Pedido calórico — considere reduzir porções ou trocar por opções mais leves.'
      : 'Pedido moderado — boas escolhas!';

  return {
    totalCalorias,
    porItem,
    sugestoes,
    dicasSuavizar,
    observacoes,
    source: 'local',
  };
}
