import type { FastifyReply, FastifyRequest } from "fastify";
import { pino } from "pino";
import { UserService } from "../services/userService.js";

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
        message: "Sucesso ao listar usuários",
        count: users.length,
        users,
      });
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error({ error }, "[Controller] Error listing users");
      return reply.status(500).send({
        error: "Erro ao listar usuários",
        details: errMessage,
      });
    }
  }

  // Método para criar um novo usuário
  async createUser(
    request: FastifyRequest<{ Body: { name: string; email: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const userData = request.body;
      logger.info({ userData }, "[Controller] Received request to create user");

      const newUser = await this.userService.createUser(userData);
      logger.info({ userId: newUser.id, email: newUser.email }, "[Controller] User created successfully");

      return reply.status(201).send(newUser);
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Verifica se o erro é relacionado ao email duplicado
      if (errMessage === "Email já está em uso") {
        logger.warn(
          { requestBody: request.body },
          "[Controller] Email already in use",
        );
        return reply.status(409).send({ error: "Email já está em uso" });
      }

      // Adiciona detalhes do erro no log para depuração
      logger.error({ error, requestBody: request.body }, "[Controller] Error details");

      return reply
        .status(500)
        .send({ error: "Erro ao criar usuário", details: errMessage });
    }
  }
}
