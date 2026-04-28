import type { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController.js";

const userController = new UserController();

export async function userRoutes(app: FastifyInstance) {
  app.post(
    "/users",
    {
      schema: {
        tags: ["Users"],
        summary: "Cria usuário",

        body: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
        },

        response: {
          201: {
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
    userController.createUser.bind(userController)
  );

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