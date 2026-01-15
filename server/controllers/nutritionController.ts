'use server';

import MenuSchema from '../models/menu';
import { analyzeLocally } from '../services/nutritionLocal';
import https from 'https';

type CartItem = {
  nome_item: string;
  quantidade: number;
  tamanho?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const analyzeNutrition = async (req: any, res: any) => {
  try {
    const cartItems: CartItem[] | undefined = req.body?.cartItems;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        errorMessage:
          'Campo "cartItems" é obrigatório (array com itens do carrinho).',
      });
    }

    // Obter menu para estimativas de calorias (usado no modo local e como fallback)
    const menuDoc = await MenuSchema.findOne().lean().exec();
    if (!menuDoc) {
      console.warn(
        '[analyzeNutrition] Menu não encontrado, usando estimativas padrão.'
      );
    }

    const localResult = analyzeLocally(cartItems, menuDoc);

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(200).json(localResult);
    }

    try {
      const payload = {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'Você é um nutricionista que analisa pedidos de pizza e bebidas para um aplicativo de pizzaria. Responda em português brasileiro, de forma direta, amigável e prática. Adicione dicas práticas de como as pessoas podem diminuir os danos após consumir uma refeição calórica. Responda APENAS com um JSON válido (RFC 8259). Não use markdown. Não inclua texto antes ou depois do JSON. Se precisar usar quebras de linha nas strings, use "\\n" escapado.',
          },
          {
            role: 'user',
            content:
              'Analise os dados a seguir e responda APENAS com um JSON puro (sem markdown) no formato: ' +
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
        max_tokens: 512,
        temperature: 0.6,
      };

      const requestBody = JSON.stringify(payload);

      const options: https.RequestOptions = {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Length': Buffer.byteLength(requestBody),
        },
      };

      const groqResponse = await new Promise<string>((resolve, reject) => {
        const reqGroq = https.request(options, (resGroq) => {
          let data = '';
          resGroq.on('data', (chunk) => {
            data += chunk;
          });
          resGroq.on('end', () => {
            resolve(data);
          });
        });

        reqGroq.on('error', (err) => {
          reject(err);
        });

        reqGroq.write(requestBody);
        reqGroq.end();
      });

      let groqObservacoes = localResult.observacoes;
      let groqSugestoesExtra: string[] | null = null;
      let groqDicasExtra: string[] | null = null;
      try {
        const parsed = JSON.parse(groqResponse);
        const content = parsed?.choices?.[0]?.message?.content ?? '';
        if (typeof content === 'string') {
          try {
            // Tenta limpar markdown ou extrair apenas o JSON
            let cleanedContent = content.trim();
            // Remove blocos de código markdown se existirem (ex: ```json ... ```)
            if (cleanedContent.includes('```')) {
              cleanedContent = cleanedContent
                .replace(/```json/g, '')
                .replace(/```/g, '');
            }

            // Busca o primeiro '{' e o último '}' para garantir que pegamos apenas o objeto JSON
            const firstBrace = cleanedContent.indexOf('{');
            const lastBrace = cleanedContent.lastIndexOf('}');

            if (firstBrace !== -1 && lastBrace !== -1) {
              cleanedContent = cleanedContent.substring(
                firstBrace,
                lastBrace + 1
              );
            }

            const ai = JSON.parse(cleanedContent);
            if (typeof ai.observacoes === 'string') {
              groqObservacoes = ai.observacoes;
            }
            if (Array.isArray(ai.sugestoes)) {
              groqSugestoesExtra = ai.sugestoes.filter(
                (s: unknown) => typeof s === 'string'
              );
            }
            if (Array.isArray(ai.dicas_suavizar)) {
              groqDicasExtra = ai.dicas_suavizar.filter(
                (s: unknown) => typeof s === 'string'
              );
            }
          } catch (e) {
            console.warn(
              '[analyzeNutrition] Conteúdo do Groq não é JSON válido, tentando extração manual:',
              e
            );

            // Tentativa de fallback com regex para salvar pelo menos as observações
            // Procura por "observacoes": "..." (considerando escapes)
            const obsMatch = content.match(
              /"observacoes"\s*:\s*"((?:[^"\\]|\\.)*)"/
            );
            if (obsMatch && obsMatch[1]) {
              groqObservacoes = obsMatch[1];
            } else {
              // Se falhar tudo, mantém o local
              groqObservacoes = localResult.observacoes;
            }
          }
        }
      } catch (e) {
        console.warn(
          '[analyzeNutrition] Falha ao fazer parse da resposta do Groq:',
          e
        );
        groqObservacoes = localResult.observacoes;
      }

      return res.status(200).json({
        ...localResult,
        observacoes: groqObservacoes,
        sugestoes: groqSugestoesExtra || localResult.sugestoes,
        dicasSuavizar: groqDicasExtra || localResult.dicasSuavizar,
        source: localResult.source,
      });
    } catch (e) {
      console.error(
        '[analyzeNutrition] Erro ao chamar Groq, usando apenas resultado local:',
        e
      );
      return res.status(200).json(localResult);
    }
  } catch (error) {
    console.error('[analyzeNutrition] Error:', error);
    return res.status(500).json({ errorMessage: String(error) });
  }
};
