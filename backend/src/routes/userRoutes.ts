import type { FastifyInstance } from "fastify";
import { userController } from "../controllers/UserController.js";

export async function userRoutes(app: FastifyInstance) {
  app.get(
    "/users",
    {
      schema: {
        tags: ["Users"],
        summary: "Lista usuários",
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              count: { type: "number" },
              users: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    email: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    userController.listUsers.bind(userController)
  );
}