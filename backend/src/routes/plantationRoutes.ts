import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { PlantationController } from "../controllers/plantationController.js";

const plantationController = new PlantationController();

export async function plantationRoutes(app: FastifyInstance) {

  app.post(
    "/plantations",
    {
      schema: {
        tags: ["Plantations"],
        summary: "Cria plantação",

        body: {
          type: "object",
          required: ["name", "userId"],
          properties: {
            name: { type: "string" },
            userId: { type: "string" },
          },
        },

        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              userId: { type: "string" },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const data = z
        .object({
          name: z.string().min(1),
          userId: z.string().min(1),
        })
        .parse(req.body);

      return plantationController.createPlantation(
        { ...req, body: data },
        reply
      );
    }
  );

  app.get(
    "/plantations",
    {
      schema: {
        tags: ["Plantations"],
        summary: "Lista plantações do usuário",

        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                userId: { type: "string" },
              },
            },
          },
        },
      },
    },
    plantationController.getPlantationsByUser.bind(plantationController)
  );

  app.delete(
    "/plantations/:id",
    {
      schema: {
        tags: ["Plantations"],
        summary: "Remove plantação",

        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      const { id } = z
        .object({ id: z.string().min(1) })
        .parse(req.params);

      return plantationController.deletePlantation(
        { ...req, params: { id } },
        reply
      );
    }
  );
}