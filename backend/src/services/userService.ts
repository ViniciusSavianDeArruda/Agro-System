import { UserRepository } from '../repositories/userRepository.js';
import { pino } from "pino";

const userRepository = new UserRepository();
const logger = pino();

export class UserService {
  // Método para listar todos os usuários
  async getAllUsers(): Promise<any[]> {
    try {
      logger.info("[Service] Fetching users in UserService");
      const users = await userRepository.getAllUsers();
      logger.info({ users }, "[Service] Users fetched in UserService");
      return users;
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error({ error }, "[Service] Error in UserService while fetching users");
      throw new Error(`Service Error: ${errMessage}`);
    }
  }

  // Método para criar um usuário com validação de dados
  async createUser(data: { name: string; email: string }): Promise<any> {
    // Validação simples de email
    if (!data.email.includes('@')) {
      throw new Error('Email inválido');
    }

    // Verifica se o email já existe no banco de dados
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Chama o repository para criar o usuário
    return userRepository.createUser(data);
  }
}