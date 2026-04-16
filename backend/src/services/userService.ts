import { UserRepository } from '../repositories/userRepository.js';

const userRepository = new UserRepository();

export class UserService {
  // Método para listar todos os usuários
  async getAllUsers(): Promise<any[]> {
    return userRepository.getAllUsers();
  }

  // Método para criar um usuário com validação de dados
  async createUser(data: { name: string; email: string }): Promise<any> {
    // Validação simples de email
    if (!data.email.includes('@')) {
      throw new Error('Email inválido');
    }

    // Chama o repository para criar o usuário
    return userRepository.createUser(data);
  }
}