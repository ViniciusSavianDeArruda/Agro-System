import { prisma } from "../database/prismaClient.js";
import { nanoid } from "nanoid";

export class PlantationRepository {
  async createPlantation(data: { name: string; userId: string }) {
    const id = nanoid(10);

    return prisma.plantation.create({
      data: {
        id,
        ...data,
      },
    });
  }

  async getPlantationsByUser(userId: string) {
    return prisma.plantation.findMany({
      where: { userId },
    });
  }

  async deletePlantation(id: string) {
    return prisma.plantation.delete({
      where: { id },
    });
  }
}