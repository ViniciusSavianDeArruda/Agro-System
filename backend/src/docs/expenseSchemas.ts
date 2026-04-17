export const expenseRoutesDocs = {
  createExpense: {
    body: {
      type: 'object',
      properties: {
        plantationId: { type: 'string', format: 'uuid' },
        description: { type: 'string' },
        amount: { type: 'number' },
        date: { type: 'string', format: 'date' },
      },
      required: ['plantationId', 'description', 'amount', 'date'],
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          plantationId: { type: 'string', format: 'uuid' },
          description: { type: 'string' },
          amount: { type: 'number' },
          date: { type: 'string', format: 'date' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};