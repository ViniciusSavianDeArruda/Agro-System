import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply
      .status(401)
      .send({ error: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return reply
      .status(401)
      .send({ error: 'Token is missing' });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string };

    // injeta usuário no request
    request.user = {
      id: decoded.id,
    };

    return; // importante: encerra middleware corretamente
  } catch (error) {
    return reply
      .status(401)
      .send({ error: 'Invalid or expired token' });
  }
}