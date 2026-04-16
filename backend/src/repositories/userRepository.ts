import { prisma } from "../prismaClient.js";

export class UserRepository {
  // Método para listar todos os usuários
  async getAllUsers(): Promise<any[]> {
    return prisma.user.findMany();
  }

  // Método para criar um usuário no banco de dados
  async createUser(data: { name: string; email: string }): Promise<any> {
    return prisma.user.create({
      data,
    });
  }
}