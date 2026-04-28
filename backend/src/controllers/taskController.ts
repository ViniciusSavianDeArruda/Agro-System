import type { FastifyReply, FastifyRequest } from "fastify";
import { taskService } from "../services/taskService.js";

interface ParamsWithId {
  id: string;
}

export class TaskController {
  async createTask(req: FastifyRequest, reply: FastifyReply) {
    const task = await taskService.createTask(req.body as any);

    return reply.status(201).send(task);
  }

  async listTasks(req: FastifyRequest, reply: FastifyReply) {
    const tasks = await taskService.listTasks();

    return reply.send(tasks);
  }

  async updateTask(
    req: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;

    const updatedTask = await taskService.updateTask(id, req.body as any);

    return reply.send(updatedTask);
  }

  async deleteTask(
    req: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;

    await taskService.deleteTask(id);

    return reply.status(204).send();
  }
}

export const taskController = new TaskController();