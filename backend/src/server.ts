import Fastify from "fastify"
import dotenv from "dotenv"

dotenv.config()

const app = Fastify()

app.get("/", async () => {
  return { message: "API System- agro na porta 3001" }
})

app.listen({ port: 3001 }).then(() => {
  console.log("Servidor rodando na porta 3001")
})