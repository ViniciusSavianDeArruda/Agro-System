# Agro System — Instruções para o Copilot

## Contexto do Projeto

Você está me ajudando a construir o **Agro System**, um sistema de gestão agrícola para pequenos produtores rurais.

---

## Stack do Backend

### Runtime & Linguagem
- Node.js + **TypeScript** (`"type": "module"` no package.json)

### Servidor HTTP
- **Fastify v5** — framework principal
- **@fastify/cors** — liberação de CORS configurada por origem explícita (nunca `origin: "*"` em produção)
- **@fastify/helmet** — headers HTTP de segurança obrigatórios (XSS, clickjacking, MIME sniffing)
- **@fastify/rate-limit** — proteção contra brute force e abuso de API
- **@fastify/swagger** — geração automática de documentação OpenAPI
- **@fastify/swagger-ui** — UI visual da documentação (Swagger UI)

### ORM e Banco de Dados
- **Prisma ORM v7** (conexão configurada via `prisma.config.ts`, não no `schema.prisma`)
- **PostgreSQL** rodando via **Docker** (`docker-compose.yml` + `Dockerfile` na raiz do backend)

### Validação
- **Zod v4** — validação de dados de entrada nas rotas com `.strip()` obrigatório para remover campos extras

### Autenticação
- **JWT** com access token de curta duração + refresh token de longa duração
- Tokens armazenados de forma segura (refresh token em cookie `httpOnly`)
- Nunca expor o payload completo do JWT no cliente

### Logging
- **pino-pretty** — logs formatados e legíveis no terminal
- **Regra:** nunca logar senhas, tokens, CPFs ou qualquer dado sensível

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
    │   ├── config/        # validação de variáveis de ambiente com Zod
    │   ├── controllers/   # recebe a requisição, chama o service, responde
    │   ├── docs/          # schemas do Swagger separados por entidade
    │   ├── routes/        # definição das rotas Fastify + schemas Swagger
    │   ├── services/      # regras de negócio (cálculos, lógica de domínio)
    │   ├── repositories/  # acesso ao banco de dados via Prisma
    │   ├── errors/        # classes de erro tipadas (NotFoundError, etc.)
    │   ├── middlewares/   # autenticação JWT, verificação de permissões
    │   ├── database/      # instância do PrismaClient
    │   └── server.ts      # entrada da aplicação (inicializa Fastify)
    ├── prisma/
    │   ├── migrations/    # histórico de migrations do banco
    │   └── schema.prisma  # modelos do banco (sem URL de conexão)
    ├── prisma.config.ts   # URL de conexão e config do Prisma v7
    ├── .env               # variáveis de ambiente (nunca commitar)
    ├── .env.example       # template das variáveis (sempre manter atualizado)
    ├── Dockerfile
    ├── docker-compose.yml
    ├── .gitignore
    ├── package.json
    ├── pnpm-lock.yaml
    └── tsconfig.json
```

---

## Arquitetura em Camadas

A comunicação entre camadas segue esta ordem **obrigatória**. Nenhuma camada pode pular outra.

```
Requisição HTTP
      ↓
   Route          → define o endpoint, schema Swagger e chama o controller
      ↓
  Controller      → recebe, valida com Zod, chama o service, responde
      ↓
   Service        → executa a regra de negócio, chama o repository
      ↓
  Repository      → toda comunicação com o Prisma acontece aqui
      ↓
   Prisma ORM
      ↓
  PostgreSQL
```

### Responsabilidade de cada camada

- **Route:** registra o endpoint no Fastify, define o schema OpenAPI para o Swagger e associa ao controller. Não contém lógica.
- **Controller:** extrai dados da requisição, executa a validação com Zod, chama o service correspondente e retorna a resposta HTTP. Não contém regra de negócio.
- **Service:** contém toda a lógica de negócio. Pode chamar múltiplos repositories. Lança erros tipados quando uma regra é violada. Não conhece `request` ou `reply`.
- **Repository:** único lugar onde o Prisma é chamado. Retorna entidades do banco. Não conhece regras de negócio.
- **Errors:** classes de erro tipadas que permitem que o Fastify retorne respostas HTTP corretas (`NotFoundError → 404`, `UnauthorizedError → 401`, etc.).

---

## Segurança

### Variáveis de Ambiente
- **Todas** as variáveis de ambiente devem ser validadas com Zod em `src/config/env.ts` na inicialização do servidor
- O servidor não pode subir com variáveis ausentes ou inválidas — deve lançar erro e encerrar
- Nunca commitar o `.env`. Manter sempre o `.env.example` atualizado

### Headers HTTP
- `@fastify/helmet` deve estar registrado **antes** de qualquer rota
- Nunca desabilitar políticas do helmet sem justificativa documentada no código

### CORS
- Em desenvolvimento: pode liberar `localhost`
- Em produção: apenas origens explícitas e conhecidas (`ALLOWED_ORIGIN` via variável de ambiente)
- Nunca usar `origin: "*"` em produção

### Rate Limiting
- Aplicar `@fastify/rate-limit` globalmente
- Rotas de autenticação (login, refresh, cadastro) devem ter limites mais restritivos

### Autenticação e Autorização
- Toda rota privada deve passar pelo middleware de autenticação JWT
- O middleware extrai o `userId` do token e injeta em `request.user`
- O service deve verificar se o recurso solicitado pertence ao `userId` autenticado antes de qualquer operação
- Nunca confiar em `userId` vindo do body da requisição — sempre usar o token

### Dados Sensíveis
- **Nunca** logar: senhas, tokens JWT, refresh tokens, dados pessoais
- Senhas devem ser armazenadas com **bcrypt** (mínimo 12 rounds)
- Respostas de erro não devem expor stack trace em produção
- Erros internos do banco de dados não devem chegar ao cliente com detalhes técnicos

### Validação de Entrada
- Todo dado de entrada validado com Zod **antes** de chegar ao controller
- Usar `.strip()` nos schemas Zod para remover campos não declarados automaticamente
- IDs vindos de parâmetros de rota (`params`) devem ser validados como UUIDs

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

- Cada usuário só acessa seus próprios dados (verificado no service via `userId` do token)
- Plantações pertencem a um único usuário
- Gastos e colheitas pertencem a uma plantação
- Lucro é calculado como: `receita da colheita - total de gastos da plantação`
- Estoque não pode ficar negativo (validar no service antes de qualquer baixa)
- Tarefas têm data e status de conclusão (`completed: boolean`)
- Toda rota deve ser documentada via Swagger (`@fastify/swagger`)
- Dados de entrada devem ser validados com Zod antes de chegar no controller

---

## Tratamento de Erros

### Classes de erro tipadas (em `src/errors/`)

Criar uma classe base `AppError` e estender para cada caso:

```
AppError (base)
  ├── NotFoundError       → HTTP 404
  ├── UnauthorizedError   → HTTP 401
  ├── ForbiddenError      → HTTP 403
  ├── ValidationError     → HTTP 422
  └── ConflictError       → HTTP 409
```

### Handler global
- Registrar um `setErrorHandler` no Fastify para interceptar todos os erros
- Erros do tipo `AppError`: retornar o status e mensagem definidos na classe
- Erros desconhecidos: retornar 500 com mensagem genérica, logar o detalhe internamente
- Em produção: nunca expor stack trace na resposta

---

## Testes

### Organização
- Testes unitários: ficam em `src/services/` e `src/repositories/` (arquivos `.spec.ts`)
- Testes de integração: ficam em `src/routes/` (arquivos `.test.ts`)
- Mocks do Prisma: usar `vitest.mock()` nos testes de service; nos testes de rota, usar banco de dados de teste isolado

### Cobertura mínima
- Services: 80%
- Repositories: 60%
- Controllers/Routes: cobertos pelos testes de integração

### Padrão
- Cada teste deve ser independente — nenhum teste depende do estado de outro
- Banco de testes deve ser limpo antes de cada suite de integração

---

## Documentação de Rotas (Swagger)

- Toda rota deve declarar: `tags`, `summary`, `body` (quando aplicável), `params` (quando aplicável), `response` para todos os status possíveis
- Schemas de request e response devem ser definidos com Zod e convertidos para JSON Schema
- A documentação deve estar sempre sincronizada com o comportamento real da rota

### Organização dos Schemas de Documentação

Os schemas usados pelo Swagger ficam em `src/docs/`, separados por entidade:

```
src/docs/
├── expenseSchemas.ts      # schemas de request/response das rotas de gastos
├── harvestSchemas.ts      # schemas de request/response das rotas de colheitas
├── plantationSchemas.ts   # schemas de request/response das rotas de plantações
├── routeSchemas.ts        # schemas compartilhados entre rotas (ex: resposta de erro)
└── userSchemas.ts         # schemas de request/response das rotas de usuários
```

- Cada arquivo exporta os schemas da sua entidade (body, params, response)
- A route importa o schema correspondente de `src/docs/` e o referencia no Swagger
- Nunca definir schemas inline dentro do arquivo de rota — sempre importar de `src/docs/`

---

## Commits

- Sempre usar o padrão **Conventional Commits**
- Exemplos: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `security:`
- Mensagens em português
- Nunca commitar arquivos `.env`, `node_modules`, ou chaves privadas

### Fluxo obrigatório ao enviar alterações para o GitHub

Sempre que eu pedir para levar alterações ao GitHub, você **deve**:

1. Rodar `git status` e me mostrar a saída completa
2. Analisar cada arquivo alterado e me explicar o que ele representa
3. Fazer **um commit por vez**, na seguinte ordem:
   - Infra/config primeiro (ex: `prisma.config.ts`, `docker-compose.yml`)
   - Arquivos de domínio/entidade (ex: `schema.prisma`)
   - Camadas internas (repository → service → controller → route)
   - Testes por último
4. Para cada commit:
   - Me explicar **o que está sendo commitado e por quê** antes de rodar o comando
   - Aguardar minha confirmação antes de executar
5. Somente após todos os commits, rodar o `git push`

**Nunca agrupar arquivos de responsabilidades diferentes em um único commit.**

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
- Se a mudança afetar segurança, me avise explicitamente

Quando sugerir código:
- Mostre o arquivo completo com a alteração
- Explique cada parte importante com comentários
- Me avise se a mudança afeta outros arquivos
- Me avise se um novo pacote precisa ser instalado, o que ele faz e por quê

Se eu errar algo:
- Me corrija de forma didática
- Explique o que causou o erro
- Me ajude a entender para não errar de novo

**Nunca:**
- Crie arquivos ou escreva código sem eu pedir
- Refatore código sem minha autorização
- Tome decisões de arquitetura por conta própria
- Instale pacotes sem avisar o que fazem e por quê
- Pule a camada de repository e acesse o Prisma diretamente no service
- Coloque lógica de negócio no controller
- Use `origin: "*"` no CORS
- Logue dados sensíveis
- Deixe variáveis de ambiente sem validação

---

## Modo Aula — Como Me Ensinar Durante o Projeto

Este projeto também é um processo de aprendizado. Cada etapa que formos construindo juntos deve ser tratada como uma **aula prática**. Siga estas regras ao me apresentar qualquer código:

### Antes de escrever o código
- Me explique **o problema que estamos resolvendo** nessa etapa
- Me diga **qual camada da arquitetura** estamos mexendo e por quê
- Me explique **o raciocínio** por trás da solução antes de mostrá-la
- Me diga se existe mais de uma forma de resolver — e por que vamos com essa

### Ao apresentar o código
- Apresente o código **em blocos pequenos**, nunca tudo de uma vez
- Cada bloco deve vir acompanhado de uma explicação em português simples
- Use **comentários didáticos** diretamente no código explicando o que aquela linha ou bloco faz
- Destaque quando um trecho for uma **boa prática** de segurança, performance ou organização
- Se usar algum conceito de TypeScript, Node.js ou do Fastify que eu possa não conhecer, **explique brevemente o conceito** antes de usá-lo

### Forma de pensar para a web
- Sempre que fizer sentido, me explique o **fluxo completo** da requisição: o que sai do frontend, passa pela rota, controller, service, repository, banco, e volta
- Me explique o **"porquê"** das decisões de arquitetura, não só o "como"
- Quando usarmos um padrão (ex: Repository Pattern, camadas separadas), me explique **qual problema aquele padrão resolve**
- Me avise quando uma decisão que estamos tomando for comum no mercado de trabalho

### Quando eu errar
- Me corrija de forma didática, explicando **o que causou o erro** e **como pensar para não errar de novo**
- Se for um erro comum entre iniciantes, me diga isso — ajuda a criar consciência
- Nunca apenas me dê a correção sem explicar o porquê

### Exemplo de como quero ser ensinado

❌ **Não quero assim:**

> "Aqui está o código do repository:"
> ```ts
> async findById(id: string) { return prisma.user.findUnique({ where: { id } }) }
> ```

✅ **Quero assim:**

> "Vamos criar a função `findById` no repository do User. Lembra que o repository é a única camada que fala com o banco? Então toda vez que precisarmos buscar um usuário pelo ID em qualquer parte do sistema, vamos chamar essa função — nunca o Prisma diretamente.
>
> O `findUnique` do Prisma busca **exatamente um registro** que corresponda à condição. Se não encontrar, ele retorna `null` (não lança erro). Por isso, mais pra frente no service, vamos checar se o retorno foi `null` e lançar um `NotFoundError` se for."
>
> ```ts
> // Busca um usuário pelo ID no banco.
> // Retorna null se não encontrar — quem decide o que fazer com isso é o service.
> async findById(id: string) {
>   return prisma.user.findUnique({
>     where: { id },
>   })
> }
> ```