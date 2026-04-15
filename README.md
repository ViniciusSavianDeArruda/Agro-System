# Agro System — Estrutura e Tecnologias do Projeto

## Contexto do Projeto

O Agro System é um sistema de gestão agrícola para pequenos produtores rurais. Este documento explica a estrutura do projeto e as tecnologias utilizadas, camada por camada.

---

## Arquitetura em Camadas

A comunicação entre camadas segue esta ordem obrigatória:

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

Cada camada tem uma responsabilidade clara, garantindo organização, manutenção e escalabilidade.

---

## Camadas e Tecnologias

### 1. Routes
- **O que é**: Define os endpoints HTTP da API.
- **Tecnologias**: Fastify, @fastify/swagger.

### 2. Controllers
- **O que é**: Recebe requisições HTTP, valida os dados e chama os services.
- **Tecnologias**: Zod.

### 3. Services
- **O que é**: Contém a lógica de negócio do sistema.

### 4. Repositories
- **O que é**: Responsável por acessar o banco de dados.
- **Tecnologias**: Prisma ORM.

### 5. Prisma ORM
- **O que é**: Conecta o código ao banco de dados.
- **Tecnologias**: Prisma.

### 6. PostgreSQL
- **O que é**: Banco de dados relacional usado no projeto.
- **Tecnologias**: PostgreSQL via Docker.

### 7. Segurança
- **Tecnologias**: @fastify/helmet, @fastify/cors, @fastify/rate-limit, JWT.

### 8. Validação
- **Tecnologias**: Zod.

### 9. Logging
- **Tecnologias**: pino-pretty.

### 10. Testes
- **Tecnologias**: Vitest, Supertest.

### 11. Documentação
- **Tecnologias**: @fastify/swagger.

### 12. Variáveis de Ambiente
- **Configuração**: .env (valores reais), .env.example (template).

---

## Resumo

O formato do projeto foi pensado para:
1. **Organização**: Cada camada tem uma responsabilidade clara.
2. **Manutenção**: Facilita alterações e correções.
3. **Segurança**: Protege dados sensíveis e evita vulnerabilidades.
4. **Escalabilidade**: Permite adicionar novas funcionalidades sem bagunçar o código.

---
