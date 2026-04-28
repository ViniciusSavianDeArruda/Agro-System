import type { FastifyReply, FastifyRequest } from "fastify";
import { ExpenseService } from "../services/expenseService.js";

class ExpenseController {
  private expenseService = new ExpenseService();

  async createExpense(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req as any).user?.id;

    const expense = await this.expenseService.createExpense({
      ...(req.body as any),
      userId,
      date: new Date((req.body as any).date),
    });

    return reply.status(201).send(expense);
  }

  async getExpensesByPlantation(req: FastifyRequest, reply: FastifyReply) {
    const { plantationId } = req.params as any;

    const expenses =
      await this.expenseService.getExpensesByPlantation(plantationId);

    return reply.send(expenses);
  }

  async deleteExpense(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as any;

    await this.expenseService.deleteExpense(id);

    return reply.status(204).send();
  }
}

export const expenseController = new ExpenseController();