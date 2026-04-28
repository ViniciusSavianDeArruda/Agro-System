import { Prisma } from "@prisma/client";
import { prisma } from "../database/prismaClient.js";

export class InventoryRepository {
  async create(data: Prisma.InventoryCreateInput) {
    return prisma.inventory.create({
      data,
    });
  }

  async update(id: string, data: Prisma.InventoryUpdateInput) {
    return prisma.inventory.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.inventory.delete({
      where: { id },
    });
  }

  async findAll() {
    return prisma.inventory.findMany();
  }

  async findById(id: string) {
    return prisma.inventory.findUnique({
      where: { id },
    });
  }
}