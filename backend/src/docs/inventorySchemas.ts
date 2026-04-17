export const inventoryRoutesDocs = {
  createInventory: {
    summary: 'Adiciona item ao inventário',
    description: 'Cria um item no inventário do usuário.',
    body: {
      type: 'object',
      properties: {
        userId: { type: 'string', format: 'uuid' },
        item: { type: 'string' },
        quantity: { type: 'integer' },
      },
      required: ['userId', 'item', 'quantity'],
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          item: { type: 'string' },
          quantity: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  listInventories: {
    summary: 'Lista inventários do usuário',
    description: 'Retorna todos os itens de inventário para o usuário autenticado.',
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            item: { type: 'string' },
            quantity: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  updateInventory: {
    summary: 'Atualiza item do inventário',
    description: 'Atualiza dados de um item de inventário pelo ID.',
    body: {
      type: 'object',
      properties: {
        item: { type: 'string' },
        quantity: { type: 'integer' },
      },
      required: ['item', 'quantity'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          item: { type: 'string' },
          quantity: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  deleteInventory: {
    summary: 'Deleta item do inventário',
    description: 'Remove um item do inventário pelo seu ID.',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
      required: ['id'],
    },
    response: {
      204: {
        description: 'No Content',
      },
    },
  },
};