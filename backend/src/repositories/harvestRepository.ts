import { prisma } from "../database/prismaClient.js";
import { nanoid } from "nanoid";

export class HarvestRepository {
  async createHarvest(data: {
    plantationId: string;
    revenue: number;
    date: Date;
  }) {
    const id = nanoid(10);

    return prisma.harvest.create({
      data: { id, ...data },
    });
  }

  async getHarvestsByPlantation(plantationId: string) {
    return prisma.harvest.findMany({
      where: { plantationId },
    });
  }

  async deleteHarvest(id: string) {
    return prisma.harvest.delete({
      where: { id },
    });
  }
}