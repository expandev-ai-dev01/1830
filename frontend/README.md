# FoodTrack - Frontend

Sistema de Controle de Compras de Alimentos

## Tecnologias

- React 19.2.0
- TypeScript 5.6.3
- Vite 5.4.11
- TailwindCSS 3.4.14
- React Router DOM 7.9.3
- TanStack Query 5.90.2
- React Hook Form 7.63.0
- Zod 4.1.11

## Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
│   ├── App.tsx            # Componente raiz
│   ├── providers.tsx      # Provedores globais
│   └── router.tsx         # Configuração de rotas
├── pages/                 # Páginas da aplicação
│   ├── layouts/          # Layouts compartilhados
│   ├── Home/             # Página inicial
│   └── NotFound/         # Página 404
├── domain/               # Domínios de negócio
├── core/                 # Componentes e utilitários compartilhados
│   ├── components/       # Componentes genéricos
│   ├── lib/             # Configurações de bibliotecas
│   └── utils/           # Funções utilitárias
└── assets/              # Recursos estáticos
    └── styles/          # Estilos globais
```

## Comandos

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## Configuração

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## Arquitetura

O projeto segue uma arquitetura modular baseada em domínios:

- **app/**: Configuração central da aplicação
- **pages/**: Componentes de página para roteamento
- **domain/**: Lógica de negócio organizada por domínio
- **core/**: Código compartilhado entre domínios

## Padrões de Código

- TypeScript strict mode habilitado
- Path alias `@/` configurado para `src/`
- Componentes funcionais com hooks
- TanStack Query para gerenciamento de estado do servidor
- React Hook Form + Zod para formulários e validação
- TailwindCSS para estilização

## Integração com Backend

O frontend se comunica com o backend através de dois clientes HTTP:

- **publicClient**: Endpoints públicos (`/api/v1/external`)
- **authenticatedClient**: Endpoints autenticados (`/api/v1/internal`)

Ambos configurados em `src/core/lib/api.ts`.