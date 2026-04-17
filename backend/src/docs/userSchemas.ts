export const createUserSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
  },
  required: ["name", "email"],
};

export const createUserResponseSchema = {
  201: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      email: { type: "string" },
    },
  },
  500: {
    type: "object",
    properties: {
      error: { type: "string" },
    },
  },
};

export const listUsersResponseSchema = {
  200: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
      },
    },
  },
  500: {
    type: "object",
    properties: {
      error: { type: "string" },
    },
  },
};

export const plantationSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    userId: { type: "string", format: "uuid" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: ["id", "name", "userId", "createdAt", "updatedAt"],
};

export const harvestSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    plantationId: { type: "string", format: "uuid" },
    revenue: { type: "number" },
    date: { type: "string", format: "date" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: ["id", "plantationId", "revenue", "date", "createdAt", "updatedAt"],
};

export const expenseSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    plantationId: { type: "string", format: "uuid" },
    description: { type: "string" },
    amount: { type: "number" },
    date: { type: "string", format: "date" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: [
    "id",
    "plantationId",
    "description",
    "amount",
    "date",
    "createdAt",
    "updatedAt",
  ],
};
