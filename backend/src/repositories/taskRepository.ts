import type { Task } from "@prisma/client";
import { prisma } from "../database/prismaClient.js";

export const taskRepository = {
  async create(data: Omit<Task, "id">): Promise<Task> {
    return prisma.task.create({ data });
  },

  async findAll(): Promise<Task[]> {
    return prisma.task.findMany();
  },

  async update(id: string, data: Partial<Task>): Promise<Task> {
    return prisma.task.update({ where: { id }, data });
  },

  async delete(id: string): Promise<Task> {
    return prisma.task.delete({ where: { id } });
  },
};
