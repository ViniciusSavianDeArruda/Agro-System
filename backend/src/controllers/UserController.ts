import type { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../services/userService.js';
import { pino } from "pino";

const logger = pino();

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Método para listar usuários
  async listUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      logger.info("[Controller] Received request to list users");
      const users = await this.userService.getAllUsers();
      logger.info({ users }, "[Controller] Users listed successfully");
      return reply.send({
        message: 'Sucesso ao listar usuários',
        count: users.length,
        users,
      });
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error({ error }, "[Controller] Error listing users");
      return reply.status(500).send({
        error: 'Erro ao listar usuários',
        details: errMessage,
      });
    }
  }

  // Método para criar um novo usuário
  async createUser(request: FastifyRequest<{ Body: { name: string; email: string } }>, reply: FastifyReply) {
    try {
      const userData = request.body;
      const newUser = await this.userService.createUser(userData);
      return reply.status(201).send(newUser);
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao criar usuário' });
    }
  }
}