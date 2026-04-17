import type { FastifyInstance } from 'fastify';
import { PlantationController } from '../controllers/plantationController.js';
import { plantationRoutesDocs } from '../docs/plantationSchemas.js';
import { z } from 'zod';

const plantationController = new PlantationController();

export async function plantationRoutes(app: FastifyInstance) {
  // Rota POST /plantations
  app.post(
    '/plantations',
    {
      schema: {
        ...plantationRoutesDocs.createPlantation,
        tags: ['Plantations'],
      },
    },
    async (req, reply) => {
    const bodySchema = z.object({
      name: z.string().min(1, 'O nome é obrigatório'),
    });

    const data = bodySchema.parse(req.body);
    return plantationController.createPlantation({ ...req, body: data }, reply);
  });

  // Rota GET /plantations
  app.get(
    '/plantations',
    {
      schema: {
        ...plantationRoutesDocs.getPlantations,
        tags: ['Plantations'],
      },
    },
    async (req, reply) => {
    return plantationController.getPlantationsByUser(req, reply);
  });

  // Rota DELETE /plantations/:id
  app.delete(
    '/plantations/:id',
    {
      schema: {
        ...plantationRoutesDocs.deletePlantation,
        tags: ['Plantations'],
      },
    },
    async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid('ID inválido'),
    });

    const { id } = paramsSchema.parse(req.params);
    return plantationController.deletePlantation({ ...req, params: { id } }, reply);
  });
}