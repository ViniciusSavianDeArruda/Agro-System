export const expenseRoutesDocs = {
  createExpense: {
    summary: "Registra um gasto",
    description: "Cria um novo registro de gasto vinculado a uma plantação.",
    body: {
      type: "object",
      properties: {
        plantationId: { type: "string", format: "uuid" },
        description: { type: "string" },
        amount: { type: "number" },
        date: { type: "string", format: "date" },
      },
      required: ["plantationId", "description", "amount", "date"],
    },
    response: {
      201: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          plantationId: { type: "string", format: "uuid" },
          description: { type: "string" },
          amount: { type: "number" },
          date: { type: "string", format: "date" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  getExpensesByPlantation: {
    summary: "Lista gastos por plantação",
    description:
      "Retorna todos os gastos registrados para uma plantação específica.",
    params: {
      type: "object",
      properties: { plantationId: { type: "string", format: "uuid" } },
      required: ["plantationId"],
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            plantationId: { type: "string", format: "uuid" },
            description: { type: "string" },
            amount: { type: "number" },
            date: { type: "string", format: "date" },
          },
        },
      },
    },
  },
  deleteExpense: {
    summary: "Deleta um gasto",
    description: "Remove um gasto pelo seu ID.",
    params: {
      type: "object",
      properties: { id: { type: "string", format: "uuid" } },
      required: ["id"],
    },
    response: { 204: { description: "No Content" } },
  },
};
