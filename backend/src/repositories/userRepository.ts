import { prisma } from "../prismaClient.js";
import { pino } from "pino";

const logger = pino();

export class UserRepository {
  // Método para listar todos os usuários
  async getAllUsers(): Promise<any[]> {
    try {
      logger.info("[Repository] Fetching all users from the database");
      const users = await prisma.user.findMany();
      logger.info({ users }, "[Repository] Users fetched successfully");
      return users;
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error({ error }, "[Repository] Error fetching users from the database");
      throw new Error(`Repository Error: ${errMessage}`);
    }
  }

  // Método para buscar um usuário pelo email
  async findByEmail(email: string): Promise<any | null> {
    try {
      logger.info({ email }, "[Repository] Searching for user by email");
      const user = await prisma.user.findUnique({ where: { email } });
      logger.info({ user }, "[Repository] User search completed");
      return user;
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error({ error }, "[Repository] Error searching for user by email");
      throw new Error(`Repository Error: ${errMessage}`);
    }
  }

  // Método para criar um usuário no banco de dados
  async createUser(data: { name: string; email: string }): Promise<any> {
    try {
      const created = await prisma.user.create({ data });
      logger.info({ created }, '[Repository] User created successfully');
      return created;
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error }, '[Repository] Error creating user in the database');
      throw new Error(`Repository Error: ${errMessage}`);
    }
  }
}