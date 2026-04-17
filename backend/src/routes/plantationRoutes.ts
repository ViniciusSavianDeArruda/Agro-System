import type { FastifyInstance } from 'fastify';
import { PlantationController } from '../controllers/plantationController.js';
import { plantationRoutesDocs } from '../docs/plantationSchemas.js';
import { z } from 'zod';

const createPlantationSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
};

const plantationController = new PlantationController();

export async function plantationRoutes(app: FastifyInstance) {
  app.post('/plantations', {
    schema: {
      ...plantationRoutesDocs.createPlantation,
      tags: ['Plantations'],
      body: createPlantationSchema,
    },
  }, async (req, reply) => {
    const data = z.object({ name: z.string().min(1, 'O nome é obrigatório') }).parse(req.body);
    return plantationController.createPlantation({ ...req, body: data }, reply);
  });

  app.get('/plantations', {
    schema: {
      tags: ['Plantations'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
            },
          },
        },
      },
    },
  }, async (req, reply) => {
    return plantationController.getPlantationsByUser(req, reply);
  });

  app.delete('/plantations/:id', {
    schema: {
      tags: ['Plantations'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
    },
  }, async (req, reply) => {
    return plantationController.deletePlantation(req, reply);
  });
}