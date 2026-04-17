import { prisma } from '../database/prismaClient.js';

export class ExpenseRepository {
  async createExpense(data: { plantationId: string; description: string; amount: number; date: Date }) {
    return prisma.expense.create({ data });
  }

  async getExpensesByPlantation(plantationId: string) {
    return prisma.expense.findMany({ where: { plantationId } });
  }

  async deleteExpense(id: string) {
    return prisma.expense.delete({ where: { id } });
  }
}