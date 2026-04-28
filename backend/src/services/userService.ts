import { UserRepository } from "../repositories/userRepository.js";
import bcrypt from "bcrypt";

const userRepository = new UserRepository();

export class UserService {
  async getAllUsers() {
    const users = await userRepository.getAllUsers();
    return users;
  }

  async createUser(data: { name: string; email: string; password: string }) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    return userRepository.createUser({
      ...data,
      password: hashedPassword,
    });
  }
}