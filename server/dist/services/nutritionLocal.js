'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeLocally = analyzeLocally;
function analyzeLocally(cartItems, menuDoc) {
    const pizzasSalgadas = menuDoc?.pizzas_salgadas ?? [];
    const pizzasDoces = menuDoc?.pizzas_doces ?? [];
    const pizzasVegetarianas = menuDoc?.pizzas_vegetarianas ?? [];
    const bebidas = menuDoc?.bebidas ?? [];
    const findItemCal = (nome, tamanho) => {
        const findPizza = (arr) => 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        arr.find((i) => i.nome === nome);
        const foundPizza = findPizza(pizzasSalgadas) ||
            findPizza(pizzasDoces) ||
            findPizza(pizzasVegetarianas);
        if (foundPizza) {
            const slicesMap = {
                Grande: 12,
                Média: 8,
                Media: 8,
                Pequena: 6,
            };
            const defaultSlices = 8;
            const slices = tamanho
                ? (slicesMap[tamanho] ?? defaultSlices)
                : defaultSlices;
            const calPorFatia = foundPizza.calorias_por_fatia_estimada;
            const kcalPerUnit = calPorFatia != null ? calPorFatia * slices : 800;
            return { kcalPerUnit, category: 'pizza' };
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bev = bebidas.find((i) => i.nome === nome);
        if (bev) {
            const calInformada = bev.calorias_por_fatia_estimada;
            const kcalPerUnit = calInformada != null
                ? calInformada
                : fallbackBeverageCalories(bev.nome);
            return { kcalPerUnit, category: 'beverage' };
        }
        return { kcalPerUnit: 250, category: 'unknown' };
    };
    function fallbackBeverageCalories(nomeBebida) {
        const n = nomeBebida.toLowerCase();
        if (/agua|água/.test(n))
            return 0;
        if (/sem gás|com gás/.test(n) && /agua|água/.test(n))
            return 0;
        if (/zero|diet|light/.test(n))
            return 0;
        if (/suco/.test(n))
            return 110;
        if (/refrigerante|cola|guaraná|lima|limão/.test(n))
            return 150;
        if (/cerveja|beer|chopp/.test(n))
            return 150;
        if (/energético|energy/.test(n))
            return 110;
        if (/cafe|café|chá/.test(n))
            return 5;
        return 150;
    }
    const porItem = cartItems.map((ci) => {
        const { kcalPerUnit, category } = findItemCal(ci.nome_item, ci.tamanho);
        const subtotal = Math.round(kcalPerUnit * (ci.quantidade || 1));
        return {
            nome: ci.nome_item,
            caloriasUnitarias: kcalPerUnit,
            quantidade: ci.quantidade || 1,
            subtotal,
            category,
        };
    });
    const totalCalorias = porItem.reduce((acc, i) => acc + i.subtotal, 0);
    const sugestoes = [];
    if (totalCalorias > 1200) {
        sugestoes.push('Reduzir a quantidade de pizzas em 1 unidade.');
    }
    const vegetarianaMaisLeve = [...pizzasVegetarianas].sort(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a, b) => (a.calorias_por_fatia_estimada ?? 0) -
        (b.calorias_por_fatia_estimada ?? 0))[0];
    if (vegetarianaMaisLeve) {
        sugestoes.push(`Trocar por pizza vegetariana (${vegetarianaMaisLeve.nome}) para reduzir calorias.`);
    }
    const agua = bebidas.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (b) => /agua/i.test(b.nome) || (b.calorias_por_fatia_estimada ?? 0) === 0);
    const possuiBebidaCalorica = cartItems.some((ci) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item = bebidas.find((b) => b.nome === ci.nome_item);
        return !!item && (item.calorias_por_fatia_estimada ?? 0) > 0;
    });
    if (agua && possuiBebidaCalorica) {
        sugestoes.push('Trocar bebida por Água para zerar calorias da bebida.');
    }
    const dicasSuavizar = [
        'Beber água antes e durante a refeição.',
        'Fazer caminhada leve de 30 minutos.',
        'Evitar sobremesa hoje ou optar por versão zero.',
        'Adicionar salada/legumes no dia para compensar.',
    ];
    const observacoes = totalCalorias > 1200
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
