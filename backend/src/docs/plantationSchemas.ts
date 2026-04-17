export const plantationRoutesDocs = {
  createPlantation: {
    summary: 'Cria uma nova plantação',
    description: 'Essa rota permite criar uma nova plantação para o usuário autenticado.',
    body: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nome da plantação',
        },
      },
      required: ['name'],
    },
    response: {
      201: {
        description: 'Plantação criada com sucesso',
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          userId: { type: 'string', format: 'uuid' },
        },
      },
    },
  },
  deletePlantation: {
    summary: 'Deleta uma plantação',
    description: 'Essa rota permite deletar uma plantação específica do usuário autenticado.',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'ID da plantação a ser deletada',
        },
      },
      required: ['id'],
    },
    response: {
      200: {
        description: 'Plantação deletada com sucesso',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      404: {
        description: 'Plantação não encontrada',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
  getPlantations: {
    summary: 'Lista todas as plantações do usuário',
    description: 'Essa rota retorna todas as plantações associadas ao usuário autenticado.',
    response: {
      200: {
        description: 'Lista de plantações',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
          },
        },
      },
    },
  },
};