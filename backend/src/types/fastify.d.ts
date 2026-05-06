import "@fastify/oauth2";
import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
    };
  }
  interface FastifyInstance {
    googleOAuth2: import("@fastify/oauth2").OAuth2Namespace;
    prisma: any; // Adiciona suporte ao Prisma no FastifyInstance
  }
}
