import type { FastifyReply, FastifyRequest } from 'fastify';
import { inventoryService } from '../services/inventoryService.js';

export const inventoryController = {
  async createInventory(req: FastifyRequest, reply: FastifyReply) {
    const data = req.body;
    const inventory = await inventoryService.createInventory(data);
    reply.status(201).send(inventory);
  },

  async listInventories(req: FastifyRequest, reply: FastifyReply) {
    const inventories = await inventoryService.listInventories();
    reply.send(inventories);
  },

  async updateInventory(
    req: FastifyRequest<{ Params: ParamsWithId; Body: { quantity: number } }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    const { quantity } = req.body;

    const data = await inventoryService.updateInventory(id, quantity);
    reply.send(data);
  },

  async deleteInventory(
    req: FastifyRequest<{ Params: ParamsWithId }>, 
    reply: FastifyReply
  ) {
    const { id } = req.params;
    await inventoryService.deleteInventory(id);
    reply.status(204).send();
  },
};

interface ParamsWithId {
  id: string;
}

export async function getInventory(
  req: FastifyRequest<{ Params: ParamsWithId }>, 
  reply: FastifyReply
) {
  const { id } = req.params;
  const inventory = await inventoryService.getInventory(id);
  reply.send(inventory);
}