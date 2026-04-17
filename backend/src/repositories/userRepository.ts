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

  // Método para criar um usuário no banco de dados
  async createUser(data: { name: string; email: string }): Promise<any> {
    return prisma.user.create({
      data,
    });
  }
}