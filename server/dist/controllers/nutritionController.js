'use server';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeNutrition = void 0;
const menu_1 = __importDefault(require("../models/menu"));
const nutritionLocal_1 = require("../services/nutritionLocal");
const openai_1 = __importDefault(require("openai"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const analyzeNutrition = async (req, res) => {
    try {
        const cartItems = req.body?.cartItems;
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({
                errorMessage: 'Campo "cartItems" é obrigatório (array com itens do carrinho).',
            });
        }
        // Obter menu para estimativas de calorias (usado no modo local e como fallback)
        const menuDoc = await menu_1.default.findOne().lean().exec();
        if (!menuDoc) {
            console.warn('[analyzeNutrition] Menu não encontrado, usando estimativas padrão.');
        }
        const localResult = (0, nutritionLocal_1.analyzeLocally)(cartItems, menuDoc);
        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            return res.status(200).json(localResult);
        }
        try {
            const client = new openai_1.default({
                apiKey: groqApiKey,
                baseURL: 'https://api.groq.com/openai/v1',
            });
            const completion = await client.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'Você é um nutricionista que analisa pedidos de pizza e bebidas para um aplicativo de pizzaria. Responda em português brasileiro, de forma direta, amigável e prática. Adicione dicas práticas de como as pessoas podem diminuir os danos após consumir uma refeição calórica. Responda APENAS com um JSON válido (RFC 8259). Não use markdown. Não inclua texto antes ou depois do JSON.',
                    },
                    {
                        role: 'user',
                        content: 'Analise os dados a seguir e responda APENAS com um JSON puro (sem markdown) no formato: ' +
                            '{"observacoes": string, "sugestoes": string[], "dicas_suavizar": string[]} ' +
                            'onde: "observacoes" é um parágrafo mais completo explicando o pedido, ' +
                            '"sugestoes" são sugestões de escolhas ou trocas mais inteligentes, e ' +
                            '"dicas_suavizar" são dicas práticas para suavizar/compensar o impacto do pedido. ' +
                            'Use linguagem simples, direta e acolhedora.\n\n' +
                            'Dados do pedido: ' +
                            JSON.stringify({
                                totalCalorias: localResult.totalCalorias,
                                porItem: localResult.porItem,
                                sugestoesAtuais: localResult.sugestoes,
                                dicasAtuais: localResult.dicasSuavizar,
                                observacoesAtuais: localResult.observacoes,
                            }),
                    },
                ],
                max_tokens: 1024,
                temperature: 0.6,
                response_format: { type: 'json_object' },
            });
            const groqResponse = completion.choices[0]?.message?.content ?? '';
            const aiResult = {};
            try {
                const parsed = JSON.parse(groqResponse);
                if (typeof parsed.observacoes === 'string') {
                    aiResult.observacoes = parsed.observacoes;
                }
                if (Array.isArray(parsed.sugestoes)) {
                    aiResult.sugestoes = parsed.sugestoes.filter((s) => typeof s === 'string');
                }
                if (Array.isArray(parsed.dicas_suavizar)) {
                    aiResult.dicasSuavizar = parsed.dicas_suavizar.filter((s) => typeof s === 'string');
                }
                // Compatibilidade com chaves snake_case caso o modelo alucine
                if (Array.isArray(parsed.dicas_suavizar)) {
                    // Já tratado acima, mas mantendo lógica se vier como snake case no futuro
                }
            }
            catch (e) {
                console.warn('[analyzeNutrition] Falha ao fazer parse da resposta do Groq:', e);
            }
            // Fallback com dados locais (caso a IA falhe)
            return res.status(200).json({
                totalCalorias: localResult.totalCalorias,
                porItem: localResult.porItem,
                observacoes: aiResult.observacoes || localResult.observacoes,
                sugestoes: aiResult.sugestoes || localResult.sugestoes,
                dicasSuavizar: aiResult.dicasSuavizar || localResult.dicasSuavizar,
                source: aiResult.observacoes ? 'ai' : localResult.source,
            });
        }
        catch (e) {
            console.error('[analyzeNutrition] Erro ao chamar Groq, usando apenas resultado local:', e);
            return res.status(200).json(localResult);
        }
    }
    catch (error) {
        console.error('[analyzeNutrition] Error:', error);
        return res.status(500).json({ errorMessage: String(error) });
    }
};
exports.analyzeNutrition = analyzeNutrition;
