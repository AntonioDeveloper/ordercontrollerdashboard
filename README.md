# PizzaDash 🍕

O PizzaDash é uma aplicação web completa para gerenciamento de pedidos de uma pizzaria. O projeto consiste em um dashboard interativo para clientes realizarem pedidos e um sistema de backend para processamento.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15**: Framework React para produção.
- **React 19**: Biblioteca para interfaces de usuário.
- **Tailwind CSS 4**: Estilização utilitária moderna.
- **TypeScript**: Tipagem estática para maior segurança.

### Backend
- **Node.js & Express**: Servidor API RESTful.
- **MongoDB & Mongoose**: Banco de dados NoSQL e modelagem de dados.
- **TypeScript**: Backend totalmente tipado.

## 📋 Funcionalidades

- **Cardápio Interativo**: Visualização de pizzas (salgadas e doces) e bebidas.
- **Carrinho de Compras**: Adição e remoção de itens, cálculo de total.
- **Gestão de Clientes**: Cadastro e Login simplificado (apenas telefone).
- **Pedidos**: Criação e acompanhamento de pedidos em tempo real (Board de Pedidos).
- **Responsividade**: (Em desenvolvimento) Interface adaptável para diferentes dispositivos.

## 🛠️ Configuração e Instalação

### Pré-requisitos
- Node.js instalado.
- Conta no MongoDB Atlas (ou instância local do MongoDB).

### 1. Configurando o Backend (`server/`)

1. Navegue até a pasta do servidor:
   ```bash
   cd server
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na pasta `server/` e adicione a string de conexão do MongoDB:
   ```env
   ATLAS_URL=sua_string_de_conexao_mongodb_aqui
   ```

4. Inicie o servidor:
   ```bash
   npm run dev
   ```
   O servidor rodará em `http://localhost:3001`.

### 2. Configurando o Frontend (Raiz)

1. Volte para a raiz do projeto:
   ```bash
   cd ..
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente. Crie um arquivo `.env.local` na raiz:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Inicie a aplicação frontend:
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` no seu navegador.

## 📚 Documentação da API

### Contrato de Erros
A API retorna erros em formato JSON com a propriedade `errorMessage`.

- **400 Bad Request**: Validação inválida (campos obrigatórios faltando).
- **404 Not Found**: Recurso não encontrado.
- **409 Conflict**: Duplicidade de dados (ex: telefone já cadastrado).
- **500 Internal Server Error**: Erro inesperado no servidor.

### Principais Endpoints

#### Clientes
- `POST /api/signUpClient`: Cadastra novo cliente.
  - Body: `{ nome_cliente, endereco, telefone }`
- `POST /api/loginClient`: Login via telefone.
  - Body: `{ telefone }`
- `PUT /api/clients/update/:id`: Atualiza dados do cliente.

#### Pedidos
- `POST /api/createOrder`: Cria um novo pedido.
  - Requer lista de itens com `nome_item`, `quantidade` e `preco`.
- `POST /api/analyzeNutrition`: Realiza análise nutricional do carrinho.
  - Body: `{ cartItems: [...] }`
  - Retorna calorias totais, detalhamento por item e sugestões (locais ou via IA).

## 📁 Estrutura do Projeto

- **/src**: Código fonte do Frontend (Next.js).
  - **/app**: Páginas e rotas (App Router).
  - **/components**: Componentes reutilizáveis UI.
  - **/context**: Gerenciamento de estado global.
- **/server**: Código fonte do Backend (Express).
  - **/controllers**: Lógica das rotas.
  - **/models**: Schemas do Mongoose.
  - **/services**: Regras de negócio auxiliares.

---
Desenvolvido como projeto de portfólio.
