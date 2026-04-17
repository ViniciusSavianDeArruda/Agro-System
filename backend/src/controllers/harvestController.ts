import type { FastifyReply, FastifyRequest } from "fastify";
import { HarvestService } from "../services/harvestService.js";

const harvestService = new HarvestService();

export class HarvestController {
  async createHarvest(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = req.body as {
        plantationId: string;
        revenue: number;
        date: Date;
        userId?: string;
      };
      if ((req as any).user && typeof (req as any).user === "object") {
        data.userId = (req as any).user.id;
      }
      const harvest = await harvestService.createHarvest(data);
      return reply.status(201).send(harvest);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getHarvestsByPlantation(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { plantationId } = req.params as { plantationId: string };
      const harvests =
        await harvestService.getHarvestsByPlantation(plantationId);
      return reply.send(harvests);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }

  async deleteHarvest(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      await harvestService.deleteHarvest(id);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }
}
