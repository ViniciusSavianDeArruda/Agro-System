import type { FastifyReply, FastifyRequest } from "fastify";
import { InventoryService } from "../services/inventoryService.js";

interface ParamsWithId {
  id: string;
}

type CreateInventoryBody = {
  name: string;
  quantity: number;
};

export class InventoryController {
  private inventoryService = new InventoryService();

  async createInventory(
    req: FastifyRequest<{ Body: CreateInventoryBody }>,
    reply: FastifyReply
  ) {
    const inventory = await this.inventoryService.createInventory(req.body);

    return reply.status(201).send(inventory);
  }

  async listInventories(req: FastifyRequest, reply: FastifyReply) {
    const inventories = await this.inventoryService.listInventories();

    return reply.send(inventories);
  }

  async updateInventory(
    req: FastifyRequest<{ Params: ParamsWithId; Body: { quantity: number } }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    const { quantity } = req.body;

    const data = await this.inventoryService.updateInventory(id, quantity);

    return reply.send(data);
  }

  async deleteInventory(
    req: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;

    await this.inventoryService.deleteInventory(id);

    return reply.status(204).send();
  }

  async getInventory(
    req: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;

    const inventory = await this.inventoryService.getInventory(id);

    return reply.send(inventory);
  }
}

export const inventoryController = new InventoryController();