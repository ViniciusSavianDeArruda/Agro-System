import { ExpenseRepository } from "../repositories/expenseRepository.js";

const expenseRepository = new ExpenseRepository();

export class ExpenseService {
  async createExpense(data: {
    plantationId: string;
    description: string;
    amount: number;
    date: Date;
  }) {
    // Regra de negócio: validar se o valor do gasto é positivo
    if (data.amount <= 0) {
      throw new Error("O valor do gasto deve ser maior que zero.");
    }

    return expenseRepository.createExpense(data);
  }

  async getExpensesByPlantation(plantationId: string) {
    return expenseRepository.getExpensesByPlantation(plantationId);
  }

  async deleteExpense(id: string) {
    return expenseRepository.deleteExpense(id);
  }
}
