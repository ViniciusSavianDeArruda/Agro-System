export const taskRoutesDocs = {
  createTask: {
    summary: "Cria uma nova tarefa",
    description: "Adiciona uma tarefa ao calendário agrícola do usuário.",
    body: {
      type: "object",
      properties: {
        userId: { type: "string", format: "uuid" },
        description: { type: "string" },
        date: { type: "string", format: "date" },
        completed: { type: "boolean" },
      },
      required: ["userId", "description", "date"],
    },
    response: {
      201: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          description: { type: "string" },
          date: { type: "string", format: "date" },
          completed: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  listTasks: {
    summary: "Lista tarefas",
    description: "Retorna todas as tarefas do usuário autenticado.",
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            description: { type: "string" },
            date: { type: "string", format: "date" },
            completed: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  updateTask: {
    summary: "Atualiza uma tarefa",
    description: "Atualiza os dados de uma tarefa existente pelo ID.",
    body: {
      type: "object",
      properties: {
        description: { type: "string" },
        date: { type: "string", format: "date" },
        completed: { type: "boolean" },
      },
      required: ["description", "date", "completed"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          description: { type: "string" },
          date: { type: "string", format: "date" },
          completed: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  deleteTask: {
    summary: "Deleta uma tarefa",
    description: "Remove uma tarefa pelo seu ID.",
    params: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
      },
      required: ["id"],
    },
    response: {
      204: {
        description: "No Content",
      },
    },
  },
};
