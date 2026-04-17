import type { FastifyInstance } from "fastify";
import { inventoryController } from "../controllers/inventoryController.js";
import { inventoryRoutesDocs } from "../docs/inventorySchemas.js";

export async function inventoryRoutes(app: FastifyInstance) {
  app.post(
    "/inventories",
    {
      schema: { ...inventoryRoutesDocs.createInventory, tags: ["Inventories"] },
    },
    inventoryController.createInventory,
  );
  app.get(
    "/inventories",
    {
      schema: { ...inventoryRoutesDocs.listInventories, tags: ["Inventories"] },
    },
    inventoryController.listInventories,
  );
  app.put(
    "/inventories/:id",
    {
      schema: { ...inventoryRoutesDocs.updateInventory, tags: ["Inventories"] },
    },
    inventoryController.updateInventory,
  );
  app.delete(
    "/inventories/:id",
    {
      schema: { ...inventoryRoutesDocs.deleteInventory, tags: ["Inventories"] },
    },
    inventoryController.deleteInventory,
  );
}
