import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { HarvestController } from "../controllers/harvestController.js";
import { harvestRoutesDocs } from "../docs/harvestSchemas.js";

const createHarvestSchema = {
  type: "object",
  properties: {
    plantationId: { type: "string", format: "uuid" },
    revenue: { type: "number" },
    date: { type: "string", format: "date" },
  },
  required: ["plantationId", "revenue", "date"],
};

const harvestController = new HarvestController();

export async function harvestRoutes(app: FastifyInstance) {
  app.post(
    "/harvests",
    {
      schema: {
        ...harvestRoutesDocs.createHarvest,
        tags: ["Harvests"],
        body: createHarvestSchema,
      },
    },
    async (req, reply) => {
      const data = z
        .object({
          plantationId: z.string().uuid("ID da plantação inválido"),
          revenue: z.number().positive("A receita deve ser um número positivo"),
          date: z.string().datetime("Data inválida"),
        })
        .parse(req.body);
      return harvestController.createHarvest({ ...req, body: data }, reply);
    },
  );

  app.get(
    "/plantations/:plantationId/harvests",
    {
      schema: {
        ...harvestRoutesDocs.getHarvestsByPlantation,
        tags: ["Harvests"],
      },
    },
    async (req, reply) => {
      return harvestController.getHarvestsByPlantation(req, reply);
    },
  );

  app.delete(
    "/harvests/:id",
    {
      schema: {
        ...harvestRoutesDocs.deleteHarvest,
        tags: ["Harvests"],
      },
    },
    harvestController.deleteHarvest,
  );
}
