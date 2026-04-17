import { prisma } from '../prismaClient.js';

export class HarvestRepository {
  async createHarvest(data: { plantationId: string; revenue: number; date: Date }) {
    return prisma.harvest.create({ data });
  }

  async getHarvestsByPlantation(plantationId: string) {
    return prisma.harvest.findMany({ where: { plantationId } });
  }

  async deleteHarvest(id: string) {
    return prisma.harvest.delete({ where: { id } });
  }
}