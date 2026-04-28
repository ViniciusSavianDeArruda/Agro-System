import type { FastifyInstance } from "fastify";
import { taskController } from "../controllers/taskController.js";

export async function taskRoutes(app: FastifyInstance) {
  app.post(
    "/tasks",
    {
      schema: {
        tags: ["Tasks"],
        summary: "Cria tarefa",

        body: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            status: { type: "string" },
          },
        },

        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
              status: { type: "string" },
            },
          },
        },
      },
    },
    taskController.createTask.bind(taskController)
  );

  app.get(
    "/tasks",
    {
      schema: {
        tags: ["Tasks"],
        summary: "Lista tarefas",

        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
                status: { type: "string" },
              },
            },
          },
        },
      },
    },
    taskController.listTasks.bind(taskController)
  );

  app.put(
    "/tasks/:id",
    {
      schema: {
        tags: ["Tasks"],
        summary: "Atualiza tarefa",

        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },

        body: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            status: { type: "string" },
          },
        },
      },
    },
    taskController.updateTask.bind(taskController)
  );

  app.delete(
    "/tasks/:id",
    {
      schema: {
        tags: ["Tasks"],
        summary: "Remove tarefa",

        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    taskController.deleteTask.bind(taskController)
  );
}