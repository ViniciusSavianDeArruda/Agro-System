import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export async function authRoutes(app: FastifyInstance) {
  // LOGIN GOOGLE
  app.get("/auth/google", {
    schema: {
      summary: "Login com Google",
      description: "Redireciona o usuário para a página de autenticação do Google",
      tags: ["Auth"],
    },
  }, async (req, reply) => {
    const redirectUri =
      process.env.GOOGLE_CALLBACK_URI ||
      "http://localhost:3333/auth/google/callback";

    const googleUrl =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
      }).toString();

    return reply.redirect(googleUrl);
  });

  // CALLBACK GOOGLE
  app.get("/auth/google/callback", {
    schema: {
      summary: "Callback do Google OAuth",
      description: "Recebe o code do Google, cria ou atualiza o usuário e retorna o token JWT",
      tags: ["Auth"],
    },
  }, async (req, reply) => {
    try {
      const { code } = req.query as { code: string };

      if (!code) {
        return reply.status(400).send({ error: "Code não fornecido" });
      }

      const redirectUri =
        process.env.GOOGLE_CALLBACK_URI ||
        "http://localhost:3333/auth/google/callback";

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        return reply.status(400).send(tokenData);
      }

      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
      );

      const googleUser = await userResponse.json();

      let user = await app.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (!user) {
        user = await app.prisma.user.create({
          data: {
            name: googleUser.name,
            email: googleUser.email,
            googleId: googleUser.id,
            password: await bcrypt.hash(Math.random().toString(), 10),
          },
        });
      } else {
        user = await app.prisma.user.update({
          where: { email: googleUser.email },
          data: { name: googleUser.name, googleId: googleUser.id },
        });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      const { password, ...userWithoutPassword } = user;

      return reply.send({
        message: "Login Google realizado com sucesso",
        token,
        user: userWithoutPassword,
      });
    } catch (err: any) {
      console.error("Erro Google OAuth:", err);
      return reply.status(500).send({
        error: "Erro na autenticação Google",
        message: err?.message || String(err),
      });
    }
  });

  // REGISTER
  app.post("/auth/register", {
    schema: {
      summary: "Cadastro de usuário",
      description: "Cria um novo usuário com nome, email e senha",
      tags: ["Auth"],
      body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
        },
      },
    },
  }, async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      const message = parsed.error?.issues[0]?.message ?? "Dados inválidos";
      return reply.status(400).send({ error: message });
    }

    const { name, email, password } = parsed.data;

    const existingUser = await app.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return reply.status(400).send({ error: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await app.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return reply.status(201).send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  });

  // LOGIN NORMAL
  app.post("/auth/login", {
    schema: {
      summary: "Login de usuário",
      description: "Autentica o usuário com email e senha e retorna o token JWT",
      tags: ["Auth"],
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
      },
    },
  }, async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.issues[0]?.message ?? "Dados inválidos" });
    }

    const { email, password } = parsed.data;

    const user = await app.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return reply.send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
}