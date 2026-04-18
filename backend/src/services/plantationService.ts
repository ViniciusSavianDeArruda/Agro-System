import { PlantationRepository } from "../repositories/plantationRepository.js";
import { prisma } from "../database/prismaClient.js";

const plantationRepository = new PlantationRepository();

export class PlantationService {
  async createPlantation(data: { name: string; userId: string }) {
    // Verificar se o userId existe no banco de dados
    const userExists = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!userExists) {
      throw new Error("O usuário fornecido não existe.");
    }

    // Regra de negócio: verificar se o nome da plantação já existe para o usuário
    const existingPlantations = await plantationRepository.getPlantationsByUser(
      data.userId,
    );
    if (existingPlantations.some((p) => p.name === data.name)) {
      throw new Error("Já existe uma plantação com este nome para o usuário.");
    }

    return plantationRepository.createPlantation(data);
  }

  async getPlantationsByUser(userId: string) {
    return plantationRepository.getPlantationsByUser(userId);
  }

  async deletePlantation(id: string) {
    return plantationRepository.deletePlantation(id);
  }
}
