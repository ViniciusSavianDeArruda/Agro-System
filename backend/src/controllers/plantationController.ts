import type { FastifyReply, FastifyRequest } from "fastify";
import { PlantationService } from "../services/plantationService.js";

const plantationService = new PlantationService();

export class PlantationController {
  async createPlantation(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = req.body as { name: string; userId?: string };
      if ((req as any).user && typeof (req as any).user === "object") {
        data.userId = (req as any).user.id;
      }
      if (!data.userId) {
        return reply.status(400).send({ error: "User ID is required" });
      }
      const plantation = await plantationService.createPlantation({
        name: data.name,
        userId: data.userId,
      });
      return reply.status(201).send(plantation);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getPlantationsByUser(req: FastifyRequest, reply: FastifyReply) {
    try {
      const params = req.params as { userId?: string };
      const userId = params.userId ?? (req as any).user?.id;
      const plantations = await plantationService.getPlantationsByUser(userId);
      return reply.send(plantations);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }

  async deletePlantation(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      await plantationService.deletePlantation(id);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }
}
