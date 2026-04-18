import type { FastifyReply, FastifyRequest } from "fastify";
import { PlantationService } from "../services/plantationService.js";

const plantationService = new PlantationService();

export class PlantationController {
  async createPlantation(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = req.body as { name: string; userId: string };

      const plantation = await plantationService.createPlantation({
        name: data.name,
        userId: data.userId, // Extrai o userId do corpo da requisição
      });

      return reply.status(201).send(plantation);
    } catch (error) {
      return reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getPlantationsByUser(req: FastifyRequest, reply: FastifyReply) {
    try {
      const plantations = await plantationService.getPlantationsByUser(
        "default-user-id", // Usa o userId padrão
      );
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
