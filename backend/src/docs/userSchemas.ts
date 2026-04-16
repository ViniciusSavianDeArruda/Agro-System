export const createUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['name', 'email'],
};

export const createUserResponseSchema = {
  201: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
    },
  },
  500: {
    type: 'object',
    properties: {
      error: { type: 'string' },
    },
  },
};

export const listUsersResponseSchema = {
  200: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
    },
  },
  500: {
    type: 'object',
    properties: {
      error: { type: 'string' },
    },
  },
};