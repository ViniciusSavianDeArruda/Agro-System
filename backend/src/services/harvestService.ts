import { HarvestRepository } from '../repositories/harvestRepository.js';

const harvestRepository = new HarvestRepository();

export class HarvestService {
  async createHarvest(data: { plantationId: string; revenue: number; date: Date }) {
    // Regra de negócio: verificar se a data da colheita já foi registrada
    const existingHarvests = await harvestRepository.getHarvestsByPlantation(data.plantationId);
    if (existingHarvests.some((h: { date: Date }) => h.date.toISOString() === data.date.toISOString())) {
      throw new Error('Já existe uma colheita registrada para esta data.');
    }

    return harvestRepository.createHarvest(data);
  }

  async getHarvestsByPlantation(plantationId: string) {
    return harvestRepository.getHarvestsByPlantation(plantationId);
  }

  async deleteHarvest(id: string) {
    return harvestRepository.deleteHarvest(id);
  }
}