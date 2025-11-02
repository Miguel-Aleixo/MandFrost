🍦 MandFrost
Sistema de atendimento para sorveterias, desenvolvido com Next.js, TypeScript (ES6+) e Express.js.

📦 O que é
O MandFrost é uma aplicação web que permite gerenciar pedidos de sorvetes, cadastrar sabores, tamanhos e adicionais, e acompanhar o status de cada pedido em tempo real.
O sistema conta com um painel administrativo completo para organizar pedidos, controlar estoque e oferecer uma experiência prática, rápida e intuitiva para clientes e funcionários.

🚀 Tecnologias utilizadas
Next.js: Framework React para construção de interfaces com renderização no servidor (SSR) e geração de sites estáticos (SSG).

TypeScript (ES6+): Linguagem de programação tipada para maior segurança e manutenção do código.

Express.js: Framework Node.js para construção do backend e gerenciamento das rotas e APIs.

🧰 Funcionalidades principais

Gerenciamento de pedidos: Criação, acompanhamento e finalização de pedidos em tempo real.

Cadastro de sabores e adicionais: Inclusão e edição de opções de sorvete, tamanhos e complementos.

Painel administrativo: Controle de pedidos, estoque e informações de clientes.

Design responsivo: Layout adaptável a dispositivos móveis e desktops, garantindo boa experiência para todos os usuários.

⚙️ Como executar

Pré-requisitos

Node.js (v14 ou superior)

npm ou Yarn como gerenciador de pacotes

Passos
Clone o repositório:

git clone https://github.com/seuusuario/MandFrost.git
cd MandFrost


Instale as dependências do frontend:

cd frontend
npm install


ou

yarn install


Instale as dependências do backend:

cd ../backend
npm install


ou

yarn install


Execute o backend:

npm run dev


ou

yarn dev


Execute o frontend:

cd ../frontend
npm run dev


ou

yarn dev

🗂️ Estrutura do projeto

/
├── backend/          # Código do servidor Express.js
│   ├── routes/       # Rotas da API
│   ├── controllers/  # Lógica das rotas
│   ├── models/       # Modelos de dados
│   └── server.js     # Inicialização do backend
├── frontend/         # Código do frontend Next.js
│   ├── components/   # Componentes reutilizáveis
│   ├── app/          # Páginas e rotas do Next.js
│   ├── hooks/        # Hooks personalizados
│   ├── services/     # Conexão com backend e funções de requisição
│   ├── styles/       # Estilos globais e Tailwind
│   └── utils/        # Funções auxiliares
├── .env.local        # Variáveis de ambiente (não comitar)
├── package.json      # Dependências e scripts do projeto

⚙️ Variáveis de ambiente

Crie um arquivo .env.local na raiz do projeto com as seguintes variáveis:

FRONTEND

NEXT_PUBLIC_API_URL=http://localhost:8080/api

BACKEND / BANCO DE DADOS

PORT=5000

DB_NAME=<nome_do_seu_banco>

DB_USER=<usuario_do_banco>

DB_PASSWORD=<senha_do_banco>

DB_HOST=<host_do_banco>

JWT_SECRET=<sua_chave_secreta_jwt>

CLOUDINARY

CLOUDINARY_CLOUD_NAME=<nome_da_nuvem>

CLOUDINARY_API_KEY=<sua_api_key>

CLOUDINARY_API_SECRET=<sua_api_secret>

📄 Licença
Este projeto está licenciado sob a MIT License.
