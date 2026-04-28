import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { harvestController } from "../controllers/harvestController.js";

export async function harvestRoutes(app: FastifyInstance) {

  app.post(
    "/harvests",
    {
      schema: {
        tags: ["Harvests"],
        summary: "Cria colheita",

        body: {
          type: "object",
          required: ["plantationId", "revenue", "date"],
          properties: {
            plantationId: { type: "string", format: "uuid" },
            revenue: { type: "number" },
            date: { type: "string", format: "date-time" },
          },
        },
      },
    },
    async (req, reply) => {
      const data = z
        .object({
          plantationId: z.string().uuid(),
          revenue: z.number().positive(),
          date: z.string().datetime(),
        })
        .parse(req.body);

      return harvestController.createHarvest({ ...req, body: data }, reply);
    }
  );

  app.get(
    "/plantations/:plantationId/harvests",
    {
      schema: {
        tags: ["Harvests"],
        summary: "Lista colheitas da plantação",

        params: {
          type: "object",
          required: ["plantationId"],
          properties: {
            plantationId: { type: "string" },
          },
        },
      },
    },
    harvestController.getHarvestsByPlantation.bind(harvestController)
  );

  app.delete(
    "/harvests/:id",
    {
      schema: {
        tags: ["Harvests"],
        summary: "Remove colheita",

        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    harvestController.deleteHarvest.bind(harvestController)
  );
}