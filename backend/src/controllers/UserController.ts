import type { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../services/userService.js';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Método para listar usuários
  async listUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await this.userService.getAllUsers();
      return reply.send(users);
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao listar usuários' });
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