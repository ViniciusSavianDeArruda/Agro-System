import { prisma } from "../database/prismaClient.js";

export class PlantationRepository {
  async createPlantation(data: { name: string; userId: string }) {
    return prisma.plantation.create({ data });
  }

  async getPlantationsByUser(userId: string) {
    return prisma.plantation.findMany({ where: { userId } });
  }

  async deletePlantation(id: string) {
    return prisma.plantation.delete({ where: { id } });
  }
}
