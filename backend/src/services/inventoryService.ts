import { inventoryRepository } from '../repositories/inventoryRepository';

export const inventoryService = {
  async createInventory(data) {
    return inventoryRepository.create(data);
  },

  async listInventories() {
    return inventoryRepository.findAll();
  },

  async updateInventory(id, data) {
    return inventoryRepository.update(id, data);
  },

  async deleteInventory(id) {
    return inventoryRepository.delete(id);
  },

  async getInventory(id) {
    return inventoryRepository.findById(id);
  },
};