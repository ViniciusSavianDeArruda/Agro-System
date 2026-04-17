import type { FastifyReply, FastifyRequest } from "fastify";
import { taskService } from "../services/taskService.js";

export const taskController = {
  async createTask(req: FastifyRequest, reply: FastifyReply) {
    const data = req.body;
    const task = await taskService.createTask(data);
    reply.status(201).send(task);
  },

  async listTasks(req: FastifyRequest, reply: FastifyReply) {
    const tasks = await taskService.listTasks();
    reply.send(tasks);
  },

  async updateTask(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;
    const data = req.body;
    const updatedTask = await taskService.updateTask(id, data);
    reply.send(updatedTask);
  },

  async deleteTask(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;
    await taskService.deleteTask(id);
    reply.status(204).send();
  },
};
