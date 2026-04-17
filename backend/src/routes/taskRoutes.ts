import type { FastifyInstance } from 'fastify';
import { taskController } from '../controllers/taskController.js';
import { taskRoutesDocs } from '../docs/taskSchemas.js';

export async function taskRoutes(app: FastifyInstance) {
  app.post('/tasks', { schema: { ...taskRoutesDocs.createTask, tags: ['Tasks'] } }, taskController.createTask);
  app.get('/tasks', { schema: { ...taskRoutesDocs.listTasks, tags: ['Tasks'] } }, taskController.listTasks);
  app.put('/tasks/:id', { schema: { ...taskRoutesDocs.updateTask, tags: ['Tasks'] } }, taskController.updateTask);
  app.delete('/tasks/:id', { schema: { ...taskRoutesDocs.deleteTask, tags: ['Tasks'] } }, taskController.deleteTask);
}