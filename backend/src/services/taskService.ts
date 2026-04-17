import { taskRepository } from "../repositories/taskRepository.js";

export const taskService = {
  async createTask(data: any) {
    return taskRepository.create(data);
  },

  async listTasks() {
    return taskRepository.findAll();
  },

  async updateTask(id: any, data: any) {
    return taskRepository.update(id, data);
  },

  async deleteTask(id: any) {
    return taskRepository.delete(id);
  },
};
