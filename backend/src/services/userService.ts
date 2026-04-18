import { pino } from "pino";
import { UserRepository } from "../repositories/userRepository.js";
import bcrypt from "bcrypt";

const userRepository = new UserRepository();
const logger = pino();

export class UserService {
  // Método para listar todos os usuários
  async getAllUsers(): Promise<any[]> {
    try {
      logger.info("[Service] Fetching users in UserService");
      const users = await userRepository.getAllUsers();
      const safeUsers = users.map(({ password, ...rest }) => rest);
      logger.info({ users: safeUsers }, "[Service] Users fetched in UserService");
      return safeUsers;
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error(
        { error },
        "[Service] Error in UserService while fetching users",
      );
      throw new Error(`Service Error: ${errMessage}`);
    }
  }

  // Método para criar um usuário com validação de dados
  async createUser(
    data: { name: string; email: string; password?: string }
  ): Promise<any> {
    // Validação simples de email
    if (!data.email.includes("@")) {
      throw new Error("Email inválido");
    }

    // Verifica se o email já existe no banco de dados
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email já está em uso");
    }

    // Gera uma senha padrão se não for fornecida
    const rawPassword = data.password || "defaultPassword123";

    // Hashea a senha antes de salvar
    const hashed = await bcrypt.hash(rawPassword, 12);

    // Chama o repository para criar o usuário
    const created = await userRepository.createUser({ ...data, password: hashed });

    // Remove a senha do objeto retornado antes de enviar adiante
    const { password, ...safeUser } = created;
    return safeUser;
  }
}
