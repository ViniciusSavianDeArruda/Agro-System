import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import "dotenv/config";
import Fastify from "fastify";

import { prisma } from "./database/prismaClient.js";

import { authRoutes } from "./routes/authRoutes.js";
import { expenseRoutes } from "./routes/expenseRoutes.js";
import { harvestRoutes } from "./routes/harvestRoutes.js";
import { inventoryRoutes } from "./routes/inventoryRoutes.js";
import { plantationRoutes } from "./routes/plantationRoutes.js";
import { taskRoutes } from "./routes/taskRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";

const app = Fastify({
  logger: true,
});

// Prisma
app.decorate("prisma", prisma);

// Cookie
await app.register(fastifyCookie);

// Helmet
await app.register(helmet, {
  contentSecurityPolicy: false,
});

// CORS
await app.register(cors, {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  credentials: true,
});

// Swagger
await app.register(swagger, {
  swagger: {
    info: {
      title: "Agro System API",
      description: "Documentação da API",
      version: "1.0.0",
    },
  },
});

// Swagger JSON
app.get("/docs/json", async () => {
  return app.swagger();
});

// Swagger UI
app.get("/docs", async (req, reply) => {
  reply.type("text/html").send(`
<!DOCTYPE html>
<html>
<head>
  <title>Agro System API</title>

  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css"
  />
</head>

<body>
  <div id="swagger-ui"></div>

  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>

  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: "/docs/json",
        dom_id: "#swagger-ui",
      });
    };
  </script>
</body>
</html>
  `);
});

// Rota raiz
app.get("/", async () => {
  return {
    message: "API Agro System rodando",
  };
});

// Rotas
app.register(authRoutes);
app.register(userRoutes);
app.register(plantationRoutes);
app.register(harvestRoutes);
app.register(expenseRoutes);
app.register(inventoryRoutes);
app.register(taskRoutes);

// Porta
const PORT = Number(process.env.PORT) || 3333;

// Debug
function mask(value?: string) {
  if (!value) return "(undefined)";

  if (value.length <= 8) return "****";

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

// Iniciar servidor
app.listen({
  port: PORT,
  host: "0.0.0.0",
}).then(() => {
  console.log("Servidor rodando na porta", PORT);
});