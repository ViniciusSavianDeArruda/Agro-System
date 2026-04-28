import type { FastifyReply, FastifyRequest } from "fastify";
import { HarvestService } from "../services/harvestService.js";

const harvestService = new HarvestService();

class HarvestController {
  async createHarvest(req: FastifyRequest, reply: FastifyReply) {
    const harvest = await harvestService.createHarvest({
      ...(req.body as any),
      userId: (req as any).user?.id,
    });

    return reply.status(201).send(harvest);
  }

  async getHarvestsByPlantation(req: FastifyRequest, reply: FastifyReply) {
    const { plantationId } = req.params as any;

    const harvests =
      await harvestService.getHarvestsByPlantation(plantationId);

    return reply.send(harvests);
  }

  async deleteHarvest(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as any;

    await harvestService.deleteHarvest(id);

    return reply.status(204).send();
  }
}

export const harvestController = new HarvestController();