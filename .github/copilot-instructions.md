## Contexto do Projeto

Você está me ajudando a construir o **Agro System**, um sistema de gestão agrícola para pequenos produtores rurais.

---

## Stack do Backend

### Runtime & Linguagem
- Node.js + **TypeScript** (`"type": "module"` no package.json)

### Servidor HTTP
- **Fastify v5** — framework principal
- **@fastify/cors** — liberação de CORS para o frontend
- **@fastify/swagger** — geração automática de documentação OpenAPI
- **@fastify/swagger-ui** — UI visual da documentação (Swagger UI)

### ORM e Banco de Dados
- **Prisma ORM v7** (conexão configurada via `prisma.config.ts`, não no `schema.prisma`)
- **PostgreSQL** rodando via **Docker** (`docker-compose.yml` + `Dockerfile` na raiz do backend)

### Validação
- **Zod v4** — validação de dados de entrada nas rotas

### Logging
- **pino-pretty** — logs formatados e legíveis no terminal

### Qualidade de Código
- **ESLint** + **@typescript-eslint** — linting e regras de TypeScript
- **Prettier** — formatação de código

### Testes
- **Vitest** — testes unitários e de integração
- **Supertest** — testes de rotas HTTP

### Dev Tools
- **tsx** (`tsx watch src/server.ts`) — execução TypeScript com hot reload
- **tsconfig-paths** — suporte a aliases de paths no TypeScript

---

## Estrutura do Projeto

```
agro-system/
├── .github/
│   └── copilot-instructions.md
└── backend/
    ├── src/
    │   ├── controllers/   # lógica das requisições (recebe, valida, responde)
    │   ├── routes/        # definição das rotas Fastify
    │   ├── services/      # regras de negócio (cálculos, lógica de domínio)
    │   ├── database/      # instância do PrismaClient
    │   └── server.ts      # entrada da aplicação (inicializa Fastify)
    ├── prisma/
    │   ├── migrations/    # histórico de migrations do banco
    │   └── schema.prisma  # modelos do banco (sem URL de conexão)
    ├── prisma.config.ts   # URL de conexão e config do Prisma v7
    ├── .env               # variáveis de ambiente (DATABASE_URL etc.)
    ├── Dockerfile         # imagem Docker do backend
    ├── docker-compose.yml # orquestra backend + PostgreSQL
    ├── .gitignore
    ├── package.json       # "type": "module", scripts, dependências
    ├── pnpm-lock.yaml
    └── tsconfig.json
```

---

## Entidades do Sistema (Modelos Prisma)

- **User** — agricultor que usa o sistema
- **Plantation** — plantações (milho, soja, feijão, etc.) vinculadas a um User
- **Harvest** — colheitas vinculadas a uma Plantation
- **Expense** — gastos da lavoura (sementes, adubo, combustível) por Plantation
- **Inventory** — estoque de insumos vinculado ao User
- **Task** — calendário agrícola (lembretes e tarefas) vinculado ao User

---

## Regras de Negócio

- Cada usuário só acessa seus próprios dados (autenticação por JWT no futuro)
- Plantações pertencem a um único usuário
- Gastos e colheitas pertencem a uma plantação
- Lucro é calculado como: `receita da colheita - total de gastos da plantação`
- Estoque não pode ficar negativo (validar antes de qualquer baixa)
- Tarefas têm data e status de conclusão (`completed: boolean`)
- Toda rota deve ser documentada via Swagger (`@fastify/swagger`)
- Dados de entrada devem ser validados com **Zod** antes de chegar no controller

---

## Como Você Deve Me Ajudar

**Regra principal: você NUNCA faz nada sem minha autorização explícita.**

Antes de qualquer ação:
1. Me explique o que quer fazer e por quê
2. Me mostre a lógica por trás da decisão
3. Aguarde eu confirmar com "pode fazer", "vai", "sim" ou similar

Quando eu pedir ajuda:
- Explique a lógica antes de mostrar o código
- Me diga como aquilo se encaixa na arquitetura do projeto
- Aponte possíveis problemas ou decisões que eu deveria tomar
- Prefira soluções simples antes de soluções complexas

Quando sugerir código:
- Mostre o arquivo completo com a alteração
- Explique cada parte importante com comentários
- Me avise se a mudança afeta outros arquivos

Se eu errar algo:
- Me corrija de forma didática
- Explique o que causou o erro
- Me ajude a entender para não errar de novo

**Nunca:**
- Crie arquivos ou escreva código sem eu pedir
- Refatore código sem minha autorização
- Tome decisões de arquitetura por conta própria
- Instale pacotes sem avisar o que fazem e por quê

---
## Commits

- Sempre que sugerir, executar ou recomendar commits, use o padrão Conventional Commits.
- Se eu pedir sugestão de mensagem de commit, sempre sugira no formato Conventional Commits.
- Exemplos: feat:, fix:, chore:, refactor:, docs:, test:, etc.