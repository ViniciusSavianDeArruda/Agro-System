import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import "dotenv/config";
import Fastify from "fastify";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { expenseRoutes } from "./routes/expenseRoutes.js";
import { harvestRoutes } from "./routes/harvestRoutes.js";
import { inventoryRoutes } from "./routes/inventoryRoutes.js";
import { plantationRoutes } from "./routes/plantationRoutes.js";
import { taskRoutes } from "./routes/taskRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";

const app = Fastify();

// Registrar helmet sem Content-Security-Policy para permitir controle
// fino do CSP por rota (permitir CDN na rota /docs durante desenvolvimento)
app.register(helmet, { contentSecurityPolicy: false });

// Configurar CORS com origem permitida
app.register(cors, {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3333",
});

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

// Expor a especificação gerada pelo plugin @fastify/swagger
app.get("/docs/json", async (request, reply) => {
  // @ts-ignore - fastify adds swagger() when @fastify/swagger is registered
  const spec = (app as any).swagger ? (app as any).swagger() : {};
  reply.send(spec);
});

// Página simples do Swagger UI servida via CDN (não depende de arquivos locais)
app.get("/docs", async (request, reply) => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Agro System API docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function() {
        const ui = SwaggerUIBundle({
          url: '/docs/json',
          dom_id: '#swagger-ui',
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: 'BaseLayout'
        });
        window.ui = ui;
      };
    </script>
  </body>
</html>`;
  // CSP relaxado apenas para a página /docs durante desenvolvimento
  const csp =
    "default-src 'self' https: data:; script-src 'self' https://unpkg.com 'unsafe-inline'; style-src 'self' https://unpkg.com 'unsafe-inline'; connect-src 'self' https://unpkg.com; img-src 'self' data:;";
  reply.header("content-security-policy", csp);
  reply.header("content-type", "text/html; charset=utf-8").send(html);
});

// Ajustar CSP apenas para a rota /docs para permitir assets do CDN durante dev
// Observação: CSP da rota `/docs` é definida diretamente no handler acima.

// Not using @fastify/swagger-ui due to local static serving issues.
// We'll expose the OpenAPI JSON and serve a small Swagger UI page via CDN.

app.get("/", async () => {
  return { message: "API System- agro na porta " + process.env.PORT };
});

// Registrar rotas de usuários
app.register(userRoutes);
// Registrar rotas de domínio
app.register(plantationRoutes, { onRequest: [authMiddleware] });
app.register(harvestRoutes, { onRequest: [authMiddleware] });
app.register(expenseRoutes, { onRequest: [authMiddleware] });
app.register(inventoryRoutes, { onRequest: [authMiddleware] });
app.register(taskRoutes, { onRequest: [authMiddleware] });

// Debug: print routes to help diagnose static file serving
setTimeout(() => {
  try {
    // @ts-ignore
    console.log("\n Registered routes\n");
    // @ts-ignore
    console.log(app.printRoutes());
  } catch (err) {
    console.warn("Não foi possível imprimir rotas:", err);
  }
}, 1000);

const PORT = parseInt(process.env.PORT || "3333");

app
  .listen({ port: PORT })
  .then(() => {
    console.log(`Servidor rodando na porta ${PORT}`);
  })
  .catch((err) => {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  });
