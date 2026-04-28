import type { FastifyReply, FastifyRequest } from "fastify";
import { PlantationService } from "../services/plantationService.js";

interface ParamsWithId {
  id: string;
}

type CreatePlantationBody = {
  name: string;
};

export class PlantationController {
  private plantationService = new PlantationService();

  async createPlantation(
    req: FastifyRequest<{ Body: CreatePlantationBody }>,
    reply: FastifyReply
  ) {
    const plantation = await this.plantationService.createPlantation({
      ...req.body,
      userId: (req as any).user?.id,
    });

    return reply.status(201).send(plantation);
  }

  async getPlantationsByUser(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req as any).user?.id;

    const plantations =
      await this.plantationService.getPlantationsByUser(userId);

    return reply.send(plantations);
  }

  async deletePlantation(
    req: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;

    await this.plantationService.deletePlantation(id);

    return reply.status(204).send();
  }
}

export const plantationController = new PlantationController();