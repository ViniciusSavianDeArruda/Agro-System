import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";

export async function authRoutes(app: FastifyInstance) {
  // LOGIN GOOGLE
  app.get("/auth/google", async (req, reply) => {
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
  app.get("/auth/google/callback", async (req, reply) => {
    try {
      const { code } = req.query as { code: string };

      const redirectUri =
        process.env.GOOGLE_CALLBACK_URI ||
        "http://localhost:3333/auth/google/callback";

      // Troca code por token
      const tokenResponse = await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
          }),
        }
      );

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        return reply.status(400).send(tokenData);
      }

      // Buscar usuário Google
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      const googleUser = await userResponse.json();

      // =========================
      // CRIAR OU ATUALIZAR USER
      // =========================

      let user = await app.prisma.user.findUnique({
        where: {
          email: googleUser.email,
        },
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
          where: {
            email: googleUser.email,
          },
          data: {
            name: googleUser.name,
            googleId: googleUser.id, // 🔥 FIX PRINCIPAL
          },
        });
      }

      // JWT
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      // remover senha da resposta
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
  app.post("/auth/register", async (req, reply) => {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const existingUser = await app.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return reply.status(400).send({
        error: "Usuário já existe",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await app.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return reply.status(201).send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  });

  // LOGIN NORMAL
  app.post("/auth/login", async (req, reply) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await app.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return reply.status(401).send({
        error: "Credenciais inválidas",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return reply.status(401).send({
        error: "Credenciais inváladas",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return reply.send({ token });
  });
}