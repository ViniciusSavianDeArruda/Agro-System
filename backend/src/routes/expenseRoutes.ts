import type { FastifyInstance } from 'fastify';
import { ExpenseController } from '../controllers/expenseController.js';
import { expenseRoutesDocs } from '../docs/expenseSchemas.js';
import { z } from 'zod';

const createExpenseSchema = {
  type: 'object',
  properties: {
    plantationId: { type: 'string', format: 'uuid' },
    description: { type: 'string' },
    amount: { type: 'number' },
    date: { type: 'string', format: 'date' },
  },
  required: ['plantationId', 'description', 'amount', 'date'],
};

const expenseController = new ExpenseController();

export async function expenseRoutes(app: FastifyInstance) {
  app.post('/expenses', {
    schema: {
      ...expenseRoutesDocs.createExpense,
      tags: ['Expenses'],
      body: createExpenseSchema,
    },
  }, async (req, reply) => {
    const data = z.object({
      plantationId: z.string().uuid('ID da plantação inválido'),
      description: z.string().min(1, 'Descrição é obrigatória'),
      amount: z.number().positive('O valor deve ser positivo'),
      date: z.string().datetime('Data inválida'),
    }).parse(req.body);
    return expenseController.createExpense({ ...req, body: data }, reply);
  });

  app.get('/plantations/:plantationId/expenses', {
    schema: {
      ...expenseRoutesDocs.getExpensesByPlantation,
      tags: ['Expenses'],
    },
  }, async (req, reply) => {
    return expenseController.getExpensesByPlantation(req, reply);
  });

  app.delete('/expenses/:id', {
    schema: {
      ...expenseRoutesDocs.deleteExpense,
      tags: ['Expenses'],
    },
  }, expenseController.deleteExpense);
}