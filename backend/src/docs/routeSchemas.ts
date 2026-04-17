export const plantationRoutesDocs = {
  createPlantation: {
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    },
    headers: {
      type: "object",
      properties: {
        Authorization: {
          type: "string",
          description: "Bearer token necessário para autenticação",
        },
      },
      required: ["Authorization"],
    },
    response: {
      201: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          userId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      401: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
};

export const harvestRoutesDocs = {
  createHarvest: {
    body: {
      type: "object",
      properties: {
        plantationId: { type: "string", format: "uuid" },
        revenue: { type: "number" },
        date: { type: "string", format: "date" },
      },
      required: ["plantationId", "revenue", "date"],
    },
    headers: {
      type: "object",
      properties: {
        Authorization: {
          type: "string",
          description: "Bearer token necessário para autenticação",
        },
      },
      required: ["Authorization"],
    },
    response: {
      201: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          plantationId: { type: "string", format: "uuid" },
          revenue: { type: "number" },
          date: { type: "string", format: "date" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      401: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
};

export const expenseRoutesDocs = {
  createExpense: {
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
    headers: {
      type: "object",
      properties: {
        Authorization: {
          type: "string",
          description: "Bearer token necessário para autenticação",
        },
      },
      required: ["Authorization"],
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
      401: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
};
