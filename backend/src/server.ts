import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import dotenv from "dotenv";
import Fastify from "fastify";

dotenv.config();

const app = Fastify();

// Configurar Helmet para segurança
app.register(helmet);

// Configurar CORS com origem permitida
app.register(cors, {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
});

// Configurar Rate Limit para evitar abusos
app.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX || "100"),
  timeWindow: process.env.RATE_LIMIT_TIME_WINDOW || "1 minute",
});

// Configurar Swagger para documentação
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

// Iniciar o servidor
const PORT = parseInt(process.env.PORT || "3001");
app.listen({ port: PORT }).then(() => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
