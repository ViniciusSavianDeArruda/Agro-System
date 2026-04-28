import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import "dotenv/config";

import { userRoutes } from "./routes/userRoutes.js";
import { plantationRoutes } from "./routes/plantationRoutes.js";
import { harvestRoutes } from "./routes/harvestRoutes.js";
import { expenseRoutes } from "./routes/expenseRoutes.js";
import { inventoryRoutes } from "./routes/inventoryRoutes.js";
import { taskRoutes } from "./routes/taskRoutes.js";

const app = Fastify();

app.register(helmet, { contentSecurityPolicy: false });

app.register(cors, {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3333",
});

app.register(swagger, {
  swagger: {
    info: {
      title: "Agro System API",
      description: "Documentação da API",
      version: "1.0.0",
    },
  },
});

app.get("/docs/json", async () => {
  return app.swagger();
});

app.get("/docs", async (req, reply) => {
  reply.type("text/html").send(`
<!DOCTYPE html>
<html>
<head>
  <title>Agro System API</title>

  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
</head>

<body>
  <div id="swagger-ui"></div>

  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>

  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: "/docs/json",
        dom_id: "#swagger-ui",
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>
  `);
});


app.get("/", async () => {
  return { message: "API Agro System rodando" };
});


app.register(userRoutes);
app.register(plantationRoutes);
app.register(harvestRoutes);
app.register(expenseRoutes);
app.register(inventoryRoutes);
app.register(taskRoutes);


const PORT = Number(process.env.PORT) || 3333;

app.listen({ port: PORT }).then(() => {
  console.log("Servidor rodando na porta", PORT);
}); 