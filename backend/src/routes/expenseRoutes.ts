import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { expenseController } from "../controllers/expenseController.js";

export async function expenseRoutes(app: FastifyInstance) {

  app.post(
    "/expenses",
    {
      schema: {
        tags: ["Expenses"],
        summary: "Cria despesa",

        body: {
          type: "object",
          required: ["plantationId", "description", "amount", "date"],
          properties: {
            plantationId: { type: "string", format: "uuid" },
            description: { type: "string" },
            amount: { type: "number" },
            date: { type: "string", format: "date-time" },
          },
        },
      },
    },
    async (req, reply) => {
      const data = z
        .object({
          plantationId: z.string().uuid(),
          description: z.string().min(1),
          amount: z.number().positive(),
          date: z.string().datetime(),
        })
        .parse(req.body);

      return expenseController.createExpense(req, reply);
    }
  );

  app.get(
    "/plantations/:plantationId/expenses",
    {
      schema: {
        tags: ["Expenses"],
        summary: "Lista despesas da plantação",

        params: {
          type: "object",
          required: ["plantationId"],
          properties: {
            plantationId: { type: "string" },
          },
        },
      },
    },
    (req, reply) => expenseController.getExpensesByPlantation(req, reply)
  );

  app.delete(
    "/expenses/:id",
    {
      schema: {
        tags: ["Expenses"],
        summary: "Remove despesa",

        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    (req, reply) => expenseController.deleteExpense(req, reply)
  );
}