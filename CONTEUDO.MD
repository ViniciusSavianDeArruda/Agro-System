# 🌱 Agro System

> Sistema de gestão agrícola para pequenos produtores rurais — construído com Node.js, Fastify, Prisma e PostgreSQL.

---

## 📚 Sobre este README

Este README não é só uma documentação — é uma **aula prática**. Aqui você vai entender não apenas *como* o projeto funciona, mas *por que* cada decisão foi tomada. Se você está aprendendo desenvolvimento web enquanto constrói este projeto, leia com calma cada seção.

---

## 🗂️ Índice

1. [O que é o Agro System?](#-o-que-é-o-agro-system)
2. [O que você vai aprender construindo isso?](#-o-que-você-vai-aprender-construindo-isso)
3. [Tecnologias e por que cada uma foi escolhida](#-tecnologias-e-por-que-cada-uma-foi-escolhida)
4. [Como o projeto está organizado](#-como-o-projeto-está-organizado)
5. [A arquitetura em camadas — o coração do projeto](#-a-arquitetura-em-camadas--o-coração-do-projeto)
6. [O ciclo completo de uma requisição](#-o-ciclo-completo-de-uma-requisição)
7. [Como rodar o projeto](#-como-rodar-o-projeto)
8. [As entidades do sistema](#-as-entidades-do-sistema)
9. [Autenticação — como o login funciona na prática](#-autenticação--como-o-login-funciona-na-prática)
10. [Segurança — o que foi feito e por quê](#-segurança--o-que-foi-feito-e-por-quê)
11. [Tratamento de erros](#-tratamento-de-erros)
12. [Documentação da API](#-documentação-da-api)
13. [Testes](#-testes)
14. [Variáveis de Ambiente](#-variáveis-de-ambiente)
15. [Padrão de Commits](#-padrão-de-commits)

---

## 🌾 O que é o Agro System?

O Agro System é uma **API REST** que ajuda pequenos produtores rurais a gerenciar:

- 🌽 Suas **plantações** (milho, soja, feijão, etc.)
- 📦 Suas **colheitas** e a receita gerada
- 💸 Seus **gastos** (sementes, adubo, combustível)
- 🗃️ Seu **estoque** de insumos
- 📅 Suas **tarefas** e calendário agrícola
- 📊 Seu **lucro** (receita − gastos)

O sistema é uma **API**, o que significa que ele não tem telas — ele fornece dados para um frontend (que pode ser feito depois) através de chamadas HTTP.

---

## 🎓 O que você vai aprender construindo isso?

Ao longo deste projeto, você vai colocar em prática os principais conceitos do desenvolvimento web backend:

| Conceito | Onde aparece |
|---|---|
| Como estruturar uma API REST | Em toda a arquitetura do projeto |
| Como funciona o HTTP na prática | Nas rotas, status codes e headers |
| Arquitetura em camadas (separação de responsabilidades) | Route → Controller → Service → Repository |
| Banco de dados relacional com ORM | Prisma + PostgreSQL |
| Autenticação com JWT | Login, access token e refresh token |
| Segurança em APIs web | Helmet, CORS, Rate Limiting, bcrypt |
| Validação de dados | Zod em cada entrada da API |
| Tratamento de erros | Classes de erro tipadas + handler global |
| Testes automatizados | Vitest + Supertest |
| Docker para desenvolvimento | Banco de dados em container |
| TypeScript no mundo real | Em todo o projeto |

---

## 🛠️ Tecnologias e por que cada uma foi escolhida

### Node.js + TypeScript
**O que é:** Node.js é o ambiente que permite rodar JavaScript no servidor (fora do navegador). TypeScript adiciona tipagem estática ao JavaScript.

**Por que usar:** TypeScript evita uma classe enorme de bugs ainda durante o desenvolvimento — o editor já avisa quando você passa um dado errado para uma função. No mercado, TypeScript é praticamente obrigatório em projetos sérios.

---

### Fastify v5
**O que é:** Um framework HTTP para Node.js — ele cuida de receber as requisições HTTP, rotear para o lugar certo e enviar respostas.

**Por que não Express?** Fastify é mais rápido, tem suporte nativo a TypeScript, validação de schemas embutida e geração automática de documentação Swagger. Para projetos novos, é a escolha mais moderna.

---

### Prisma ORM v7
**O que é:** Um ORM (Object-Relational Mapper) que permite interagir com o banco de dados usando código TypeScript, sem escrever SQL diretamente.

**Por que usar:** Prisma gera tipos TypeScript automaticamente a partir do schema do banco. Isso significa que se você tentar acessar um campo que não existe, o TypeScript já vai reclamar antes mesmo de rodar o código. Além disso, as migrations são versionadas e rastreáveis.

---

### PostgreSQL + Docker
**O que é:** PostgreSQL é um banco de dados relacional poderoso e gratuito. Docker permite rodar o banco em um container isolado, sem instalar nada direto na sua máquina.

**Por que Docker?** Com Docker, qualquer pessoa que clonar o projeto consegue subir o banco com um único comando (`docker compose up`), sem precisar configurar nada manualmente.

---

### Zod v4
**O que é:** Uma biblioteca de validação de schemas para TypeScript.

**Por que usar:** Todo dado que chega na API vindo do cliente (body, params, query) deve ser validado antes de ser processado. Zod faz isso de forma declarativa e integra perfeitamente com TypeScript — após a validação, os dados já são tipados automaticamente.

---

### JWT (JSON Web Token)
**O que é:** Um padrão para autenticação stateless. Em vez de guardar sessões no servidor, o servidor emite um token assinado que o cliente guarda e envia em cada requisição.

**Por que usar:** JWT é o padrão mais usado no mercado para autenticação de APIs REST. Não exige estado no servidor, funciona bem com múltiplos servidores e é fácil de usar em frontends e apps mobile.

---

## 📁 Como o projeto está organizado

```
agro-system/
└── backend/
    ├── src/
    │   ├── config/        ← Valida as variáveis de ambiente (.env) com Zod
    │   │                    O servidor não sobe se alguma variável estiver faltando
    │   │
    │   ├── routes/        ← Define os endpoints da API (ex: POST /users, GET /plantations)
    │   │                    Também configura a documentação Swagger de cada rota
    │   │
    │   ├── controllers/   ← Recebe a requisição, valida os dados com Zod
    │   │                    e chama o service correspondente
    │   │
    │   ├── services/      ← Toda a lógica de negócio fica aqui
    │   │                    (ex: calcular lucro, verificar se estoque vai ficar negativo)
    │   │
    │   ├── repositories/  ← Único lugar que fala com o banco de dados via Prisma
    │   │                    Services nunca acessam o Prisma diretamente
    │   │
    │   ├── errors/        ← Classes de erro tipadas (NotFoundError, UnauthorizedError, etc.)
    │   │                    Permitem que o Fastify retorne o status HTTP correto
    │   │
    │   ├── middlewares/   ← Interceptam requisições antes de chegar no controller
    │   │                    Principal uso: verificar se o JWT é válido
    │   │
    │   ├── database/      ← Instância única do PrismaClient (usada por todos os repositories)
    │   │
    │   └── server.ts      ← Ponto de entrada: inicializa o Fastify, registra plugins e rotas
    │
    ├── prisma/
    │   ├── schema.prisma  ← Define os modelos do banco (tabelas, campos, relacionamentos)
    │   └── migrations/    ← Histórico de todas as alterações no banco (nunca deletar)
    │
    ├── prisma.config.ts   ← Configuração de conexão do Prisma v7 (URL do banco)
    ├── .env               ← Suas variáveis locais (nunca commitar!)
    ├── .env.example       ← Template para outros desenvolvedores saberem o que configurar
    ├── docker-compose.yml ← Sobe o PostgreSQL em um container com um comando
    └── tsconfig.json      ← Configurações do TypeScript
```

> 💡 **Dica de aprendizado:** A estrutura de pastas não é aleatória — cada pasta representa uma **responsabilidade** diferente. Isso é o princípio da Separação de Responsabilidades (SRP), um dos pilares do bom design de software.

---

## 🏗️ A arquitetura em camadas — o coração do projeto

Este é o conceito mais importante do projeto. Entender isso vai te preparar para qualquer backend no mercado.

```
  Requisição HTTP
        │
        ▼
   ┌─────────┐
   │  Route  │  → "Existe um endpoint POST /plantations? Sim. Vai pro controller."
   └────┬────┘
        │
        ▼
   ┌────────────┐
   │ Controller │  → "Os dados do body são válidos? Sim. Chama o service."
   └─────┬──────┘
         │
         ▼
   ┌─────────┐
   │ Service │  → "O usuário pode criar uma plantação? O nome já existe? Executa a regra."
   └────┬────┘
        │
        ▼
   ┌────────────┐
   │ Repository │  → "INSERT INTO plantation... — só aqui o banco é acessado."
   └─────┬──────┘
         │
         ▼
   ┌──────────┐
   │  Prisma  │
   └─────┬────┘
         │
         ▼
   ┌────────────┐
   │ PostgreSQL │
   └────────────┘
```

### Por que separar em camadas?

Imagine que amanhã você queira trocar o PostgreSQL por MongoDB. Se toda a lógica de negócio estivesse misturada com as queries do banco, você teria que reescrever tudo. Com a arquitetura em camadas, você só reescreve os **repositories** — o resto do código nem sabe que o banco mudou.

O mesmo vale para regras de negócio: se a regra de calcular lucro muda, você mexe só no **service**, sem tocar no banco ou nas rotas.

### Responsabilidade de cada camada

| Camada | Responsabilidade | O que ela NÃO faz |
|---|---|---|
| **Route** | Define o endpoint e o schema Swagger | Não contém nenhuma lógica |
| **Controller** | Valida dados de entrada, chama o service, retorna a resposta | Não contém regra de negócio |
| **Service** | Executa as regras de negócio | Não conhece `request`/`reply`, não acessa o banco diretamente |
| **Repository** | Faz as queries no banco via Prisma | Não conhece regras de negócio |

---

## 🔄 O ciclo completo de uma requisição

Vamos ver na prática o que acontece quando um usuário faz `POST /plantations` para criar uma nova plantação:

**1. A requisição chega na Route**
```
POST /plantations
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Body: { "name": "Soja Norte", "crop": "soja", "areaHectares": 12.5 }
```
A route registrou esse endpoint no Fastify. Ela identifica que essa rota é privada e ativa o middleware de autenticação.

**2. O Middleware de autenticação verifica o JWT**
O middleware lê o header `Authorization`, valida o token e injeta `request.user = { id: "uuid-do-usuario" }`. Se o token for inválido ou estiver faltando, já retorna `401 Unauthorized` aqui mesmo.

**3. O Controller recebe a requisição**
O controller pega o body da requisição e valida com Zod:
```ts
const body = CreatePlantationSchema.parse(request.body)
// Se algo estiver errado (ex: areaHectares negativo), Zod já lança um erro
```
Se os dados forem válidos, chama o service:
```ts
const plantation = await plantationService.create({ userId: request.user.id, ...body })
```

**4. O Service executa a regra de negócio**
O service verifica se o usuário já tem uma plantação com esse nome:
```ts
const existing = await plantationRepository.findByName(userId, name)
if (existing) throw new ConflictError('Você já tem uma plantação com esse nome')
```
Se estiver tudo certo, manda criar:
```ts
return plantationRepository.create({ userId, name, crop, areaHectares })
```

**5. O Repository faz a query no banco**
```ts
return prisma.plantation.create({
  data: { userId, name, crop, areaHectares }
})
```

**6. A resposta volta por todas as camadas**
O dado criado volta do banco → repository → service → controller, que monta a resposta:
```
HTTP 201 Created
{ "id": "uuid", "name": "Soja Norte", "crop": "soja", "areaHectares": 12.5 }
```

---

## 🚀 Como rodar o projeto

### Pré-requisitos

Antes de tudo, você precisa ter instalado:
- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/agro-system.git
cd agro-system/backend
```

**2. Instale as dependências**
```bash
pnpm install
```

**3. Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Abra o .env e preencha os valores (veja a seção de variáveis de ambiente)
```

**4. Suba o banco de dados com Docker**
```bash
docker compose up -d
# O -d roda em background (detached mode)
# Aguarde alguns segundos para o PostgreSQL inicializar
```

**5. Execute as migrations do banco**
```bash
pnpm prisma migrate dev
# Isso cria todas as tabelas no banco conforme o schema.prisma
```

**6. Inicie o servidor em modo desenvolvimento**
```bash
pnpm dev
# tsx watch src/server.ts — reinicia automaticamente ao salvar arquivos
```

O servidor estará disponível em `http://localhost:3333`.

A documentação Swagger estará em `http://localhost:3333/docs`.

---

## 🗃️ As entidades do sistema

Estas são as "tabelas" do banco de dados e como elas se relacionam:

```
User (agricultor)
  │
  ├── Plantation (plantação de milho, soja, etc.)
  │     ├── Harvest (colheita — registra receita)
  │     └── Expense (gasto — sementes, adubo, etc.)
  │
  ├── Inventory (estoque de insumos)
  │
  └── Task (tarefas e lembretes do calendário)
```

### Regras de negócio importantes

- Um usuário **só acessa seus próprios dados** — nunca dados de outro usuário
- O **lucro** de uma plantação é calculado como: `receita total das colheitas − total de gastos`
- O **estoque** não pode ficar negativo — o sistema valida isso antes de qualquer baixa
- **Tarefas** têm data de vencimento e um campo `completed: boolean`

---

## 🔐 Autenticação — como o login funciona na prática

O sistema usa **dois tokens JWT**:

### Access Token
- Validade curta (ex: 15 minutos)
- Enviado no header `Authorization: Bearer <token>` em toda requisição privada
- Contém o `userId` no payload
- Quando expira, o cliente usa o refresh token para renovar

### Refresh Token
- Validade longa (ex: 7 dias)
- Armazenado em um cookie `httpOnly` (JavaScript do navegador não consegue lê-lo — isso é segurança)
- Usado **apenas** para emitir um novo access token
- Se for comprometido, pode ser revogado no banco

### Fluxo visual

```
  Cliente                          Servidor
     │                                │
     │  POST /auth/login              │
     │  { email, password }  ──────►  │ Verifica email + bcrypt(password)
     │                                │
     │  ◄──  access_token (15min)     │
     │  ◄──  refresh_token (cookie)   │
     │                                │
     │  GET /plantations              │
     │  Authorization: Bearer token ► │ Valida JWT → extrai userId
     │  ◄── dados das plantações      │
     │                                │
     │  [access_token expirou]        │
     │                                │
     │  POST /auth/refresh            │
     │  (cookie enviado automático) ► │ Valida refresh token
     │  ◄──  novo access_token        │
```

> 💡 **Por que dois tokens?** Se usássemos um único token com validade longa, qualquer pessoa que roubasse esse token poderia se passar pelo usuário por muito tempo. Com access token de curta duração, o "dano" é limitado. O refresh token, guardado em cookie httpOnly, não é acessível por scripts maliciosos.

---

## 🛡️ Segurança — o que foi feito e por quê

### `@fastify/helmet`
Adiciona headers HTTP de segurança automaticamente em todas as respostas. Protege contra ataques como XSS (injeção de scripts), clickjacking (iframes maliciosos) e MIME sniffing.

### `@fastify/cors`
Controla quais origens (domínios) podem fazer requisições para a API. Em produção, apenas o domínio do frontend é permitido — nunca `*`.

### `@fastify/rate-limit`
Limita quantas requisições um cliente pode fazer por minuto. Impede ataques de brute force (tentar milhares de senhas) e abuso da API.

### bcrypt (senhas)
Senhas nunca são armazenadas em texto puro no banco. O bcrypt aplica um hash com "salt" (dados aleatórios) e múltiplas rodadas de processamento. Mesmo que alguém roube o banco, não consegue recuperar as senhas originais.

### Validação de entrada (Zod)
Todo dado vindo do cliente é tratado como **não confiável** até ser validado. O Zod verifica tipos, formatos e limites antes de qualquer processamento.

### Variáveis de ambiente validadas
O servidor se recusa a iniciar se qualquer variável de ambiente obrigatória estiver faltando ou com formato errado. Isso evita erros silenciosos em produção.

---

## ⚠️ Tratamento de Erros

O projeto usa uma hierarquia de erros tipados para que cada problema retorne o status HTTP correto:

```
AppError (erro base com status e mensagem)
  ├── NotFoundError       → 404  (recurso não encontrado)
  ├── UnauthorizedError   → 401  (não autenticado)
  ├── ForbiddenError      → 403  (autenticado, mas sem permissão)
  ├── ValidationError     → 422  (dados inválidos)
  └── ConflictError       → 409  (conflito — ex: email já cadastrado)
```

Existe um **handler global de erros** registrado no Fastify que intercepta todas as exceções. Se o erro for um `AppError`, retorna o status e mensagem definidos. Se for um erro desconhecido (bug), retorna `500` com mensagem genérica — **nunca expõe o stack trace em produção**.

> 💡 **Por que classes de erro?** Em vez de espalhar `reply.status(404).send({ message: '...' })` por todo o código, você simplesmente lança `throw new NotFoundError('Plantação não encontrada')` em qualquer camada. O handler cuida do resto. Isso deixa o código muito mais limpo.

---

## 📖 Documentação da API

A documentação é gerada automaticamente pelo `@fastify/swagger` com base nos schemas declarados em cada rota.

Com o servidor rodando, acesse:

```
http://localhost:3333/docs
```

Lá você encontra todos os endpoints, os campos esperados em cada requisição e os possíveis retornos — tudo interativo, onde você pode testar as rotas diretamente pelo navegador.

---

## 🧪 Testes

O projeto tem dois tipos de testes:

### Testes unitários (`.spec.ts`)
Testam uma unidade isolada do código — principalmente os **services** e **repositories**. O banco de dados é "mockado" (simulado), então os testes rodam rápido e sem dependências externas.

```bash
pnpm test
```

### Testes de integração (`.test.ts`)
Testam o fluxo completo de uma rota, fazendo requisições HTTP reais contra um banco de testes isolado. Garantem que route + controller + service + repository funcionam juntos.

```bash
pnpm test:integration
```

### Cobertura mínima exigida
- Services: **80%**
- Repositories: **60%**
- Controllers/Routes: cobertos pelos testes de integração

---

## 🔧 Variáveis de Ambiente

Copie o `.env.example` para `.env` e preencha:

```env
# Servidor
NODE_ENV=development
PORT=3333

# Banco de dados (deve bater com o docker-compose.yml)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/agro_system

# JWT — gere strings longas e aleatórias para produção
JWT_ACCESS_SECRET=seu-segredo-de-access-token
JWT_REFRESH_SECRET=seu-segredo-de-refresh-token
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS — domínio do seu frontend
ALLOWED_ORIGIN=http://localhost:5173
```

> ⚠️ **Nunca commite o `.env`**. Ele está no `.gitignore` por uma razão — contém segredos que não devem estar no repositório. O `.env.example` existe justamente para que outros devs saibam o que precisam configurar, sem expor os valores reais.

---

## 📝 Padrão de Commits

O projeto usa [Conventional Commits](https://www.conventionalcommits.org/). Mensagens em português.

| Prefixo | Quando usar |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `chore:` | Configuração, dependências, build |
| `refactor:` | Refatoração sem mudança de comportamento |
| `docs:` | Mudanças na documentação |
| `test:` | Adição ou correção de testes |
| `security:` | Correção de vulnerabilidade de segurança |

**Exemplos:**
```
feat: adicionar rota de criação de plantação
fix: corrigir cálculo de lucro quando não há gastos
security: aumentar rounds do bcrypt para 14
test: adicionar testes unitários para PlantationService
```

---

## 🤝 Contribuindo

Este projeto segue um fluxo de desenvolvimento guiado — nenhuma alteração é feita sem entendimento prévio do que está sendo feito e por quê. Consulte o arquivo `.github/copilot-instructions.md` para entender as regras de colaboração e o modo de aprendizado ativo.

---

<p align="center">
  Esse projeto esta em desenvolvimento ainda
</p>