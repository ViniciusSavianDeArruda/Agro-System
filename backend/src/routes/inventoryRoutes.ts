import type { FastifyInstance } from "fastify";
import { inventoryController } from "../controllers/inventoryController.js";

export async function inventoryRoutes(app: FastifyInstance) {

  app.post(
    "/inventories",
    {
      schema: {
        tags: ["Inventories"],
        summary: "Cria item no estoque",

        body: {
          type: "object",
          required: ["name", "quantity"],
          properties: {
            name: { type: "string" },
            quantity: { type: "number" },
          },
        },
      },
    },
    inventoryController.createInventory.bind(inventoryController)
  );

  app.get(
    "/inventories",
    {
      schema: {
        tags: ["Inventories"],
        summary: "Lista itens do estoque",

        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                quantity: { type: "number" },
              },
            },
          },
        },
      },
    },
    inventoryController.listInventories.bind(inventoryController)
  );

  app.get(
    "/inventories/:id",
    {
      schema: {
        tags: ["Inventories"],
        summary: "Busca item por ID",

        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    inventoryController.getInventory.bind(inventoryController)
  );

  app.put(
    "/inventories/:id",
    {
      schema: {
        tags: ["Inventories"],
        summary: "Atualiza item do estoque",

        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },

        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            quantity: { type: "number" },
          },
        },
      },
    },
    inventoryController.updateInventory.bind(inventoryController)
  );

  app.delete(
    "/inventories/:id",
    {
      schema: {
        tags: ["Inventories"],
        summary: "Remove item do estoque",

        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    inventoryController.deleteInventory.bind(inventoryController)
  );
}