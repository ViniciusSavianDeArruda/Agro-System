import { InventoryRepository } from "../repositories/inventoryRepository.js";

const inventoryRepository = new InventoryRepository();

export class InventoryService {
  async createInventory(data: any) {
    return inventoryRepository.create(data);
  }

  async listInventories() {
    return inventoryRepository.findAll();
  }

  async updateInventory(id: any, data: any) {
    return inventoryRepository.update(id, data);
  }

  async deleteInventory(id: any) {
    return inventoryRepository.delete(id);
  }

  async getInventory(id: any) {
    return inventoryRepository.findById(id);
  }
}