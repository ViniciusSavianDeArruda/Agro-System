import { taskRepository } from '../repositories/taskRepository';

export const taskService = {
  async createTask(data) {
    return taskRepository.create(data);
  },

  async listTasks() {
    return taskRepository.findAll();
  },

  async updateTask(id, data) {
    return taskRepository.update(id, data);
  },

  async deleteTask(id) {
    return taskRepository.delete(id);
  },
};