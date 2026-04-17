import { ExpenseService } from '../services/expenseService.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

const expenseService = new ExpenseService();

export class ExpenseController {
  async createExpense(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = req.body as { plantationId: string; description: string; amount: number; date: Date; userId?: string };
      if ((req as any).user && typeof (req as any).user === 'object') {
        data.userId = (req as any).user.id;
      }
      const expense = await expenseService.createExpense(data);
      return reply.status(201).send(expense);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getExpensesByPlantation(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { plantationId } = req.params as { plantationId: string };
      const expenses = await expenseService.getExpensesByPlantation(plantationId);
      return reply.send(expenses);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }

  async deleteExpense(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      await expenseService.deleteExpense(id);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }
}