import type { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/UserController.js';

const userController = new UserController();

export async function userRoutes(app: FastifyInstance) {
  // Rota para criar um novo usuário
  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: 'Cria um novo usuário',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
          },
          required: ['name', 'email'],
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
          500: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    userController.createUser.bind(userController)
  );

  // Rota para listar todos os usuários
  app.get(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: 'Lista todos os usuários',
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              count: { type: 'number' },
              users: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                  },
                },
              },
            },
          },
          500: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    userController.listUsers.bind(userController)
  );
}