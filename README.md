This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# PizzaDashApp – Contrato de Erros e Validações

## Contrato de Erros da API

- Erros retornam JSON com `errorMessage: string`.
- Status HTTP padronizados:
  - `400` Validação de payload inválida (ex.: campos obrigatórios ausentes)
  - `404` Recurso não encontrado (ex.: cliente não existe)
  - `409` Conflito de duplicidade (ex.: `telefone` já cadastrado)
  - `500` Erro interno do servidor

### Endpoints de Clientes

- `POST /api/signUpClient`
  - Valida `nome_cliente`, `endereco`, `telefone` (retorna `400` se faltando)
  - Duplicidade de `telefone` retorna `409` com `Telefone já cadastrado.`

- `POST /api/loginClient`
  - `400` se `telefone` ausente
  - `404` se não encontrado

- `PUT /api/clients/update/:id`
  - `400` para ID inválido ou body vazio
  - `404` se cliente não encontrado

### Endpoints de Pedidos

- `POST /api/createOrder`
  - `400` se `pedido` ausente ou itens sem `nome_item`, `quantidade` ou `preco`

## Banco de Dados

- `clientsData.telefone` possui índice único para evitar duplicidades.

## UI Feedbacks

- Modal de Login mapeia mensagens conforme status HTTP (400, 404, 500).
- Cadastro de Cliente exibe mensagem de duplicidade quando `409`.
