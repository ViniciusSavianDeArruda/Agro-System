export const harvestRoutesDocs = {
  createHarvest: {
    summary: "Cria uma nova colheita",
    description:
      "Registra uma nova colheita vinculada a uma plantação do usuário autenticado.",
    body: {
      type: "object",
      properties: {
        plantationId: { type: "string", format: "uuid" },
        revenue: { type: "number" },
        date: { type: "string", format: "date" },
      },
      required: ["plantationId", "revenue", "date"],
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
    },
  },
  getHarvestsByPlantation: {
    summary: "Lista colheitas por plantação",
    description:
      "Retorna todas as colheitas registradas para uma plantação específica.",
    params: {
      type: "object",
      properties: {
        plantationId: { type: "string", format: "uuid" },
      },
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
            revenue: { type: "number" },
            date: { type: "string", format: "date" },
          },
        },
      },
    },
  },
  deleteHarvest: {
    summary: "Deleta uma colheita",
    description: "Remove uma colheita pelo seu ID.",
    params: {
      type: "object",
      properties: { id: { type: "string", format: "uuid" } },
      required: ["id"],
    },
    response: { 204: { description: "No Content" } },
  },
};
