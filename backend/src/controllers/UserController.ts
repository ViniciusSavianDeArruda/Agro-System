import type { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/userService.js";

type CreateUserBody = {
  name: string;
  email: string;
  password: string;
};

export class UserController {
  private userService = new UserService();

  async listUsers(req: FastifyRequest, reply: FastifyReply) {
    const users = await this.userService.getAllUsers();

    return reply.send({
      message: "Sucesso ao listar usuários",
      count: users.length,
      users,
    });
  }

  async createUser(
    req: FastifyRequest<{ Body: CreateUserBody }>,
    reply: FastifyReply
  ) {
    const newUser = await this.userService.createUser(req.body);

    return reply.status(201).send(newUser);
  }
}

export const userController = new UserController();