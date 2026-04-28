import { prisma } from "../database/prismaClient.js";
import { nanoid } from "nanoid";

export class ExpenseRepository {
  async createExpense(data: {
    plantationId: string;
    description: string;
    amount: number;
    date: Date;
  }) {
    const id = nanoid(10);

    return prisma.expense.create({
      data: { id, ...data },
    });
  }

  async getExpensesByPlantation(plantationId: string) {
    return prisma.expense.findMany({
      where: { plantationId },
    });
  }

  async deleteExpense(id: string) {
    return prisma.expense.delete({
      where: { id },
    });
  }
}