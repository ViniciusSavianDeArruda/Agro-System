import { prisma } from "../database/prismaClient.js";

export class UserRepository {
  async getAllUsers() {
    return prisma.user.findMany();
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data,
    });
  }
}