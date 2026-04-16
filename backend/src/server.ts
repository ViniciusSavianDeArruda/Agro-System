import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import "dotenv/config";
import Fastify from "fastify";
import { userRoutes } from "./routes/userRoutes.js";

const app = Fastify();

app.register(helmet);

// Configurar CORS com origem permitida
app.register(cors, {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3333",
});

// Configurar Rate Limit para evitar abusos
// app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

// Configurar Swagger
app.register(swagger, {
  swagger: {
    info: {
      title: "Agro System API",
      description: "Documentação da API do Agro System",
      version: "1.0.0",
    },
  },
});

app.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
});

app.get("/", async () => {
  return { message: "API System- agro na porta " + process.env.PORT };
});

// Registrar rotas de usuários
app.register(userRoutes);

// Iniciar o servidor
const PORT = parseInt(process.env.PORT || "3333");
app.listen({ port: PORT }).then(() => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
