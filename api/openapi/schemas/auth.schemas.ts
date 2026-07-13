export const authSchemas = {
  User: {
    type: 'object',
    required: ['id', 'username', 'name', 'email', 'role', 'status', 'createdAt'],
    properties: {
      id: {
        type: 'string',
        example: '6842af3d9a6dcbdcb6b8a0df',
      },

      username: {
        type: 'string',
        example: 'ezepurro',
      },

      name: {
        type: 'string',
        example: 'Ezequiel Purro',
      },

      email: {
        type: 'string',
        format: 'email',
        example: 'example@gmail.com',
      },

      role: {
        type: 'string',
        enum: ['USER', 'ADMIN'],
        example: 'USER',
      },

      status: {
        type: 'string',
        enum: ['ACTIVE', 'INACTIVE'],
        example: 'ACTIVE',
      },

      createdAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  RegisterRequest: {
    type: 'object',
    required: ['username', 'name', 'email', 'password'],

    properties: {
      username: {
        type: 'string',
        example: 'ezepurro',
      },

      name: {
        type: 'string',
        example: 'Ezequiel Purro',
      },

      email: {
        type: 'string',
        format: 'email',
        example: 'example@gmail.com',
      },

      password: {
        type: 'string',
        format: 'password',
        example: 'jeffh!456jfk',
      },
    },
  },

  LoginRequest: {
    type: 'object',

    required: ['email', 'password'],

    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'example@gmail.com',
      },

      password: {
        type: 'string',
        format: 'password',
        example: 'jeffh!456jfk',
      },
    },
  },

  AccessToken: {
    type: 'string',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },

  ValidationError: {
    type: 'object',

    properties: {
      field: {
        type: 'string',
        example: 'email',
      },

      message: {
        type: 'string',
        example: 'Email inválido.',
      },
    },
  },

  ErrorResponse: {
    type: 'object',

    properties: {
      success: {
        type: 'boolean',
        example: false,
      },

      message: {
        type: 'string',
        example: 'Credenciales inválidas.',
      },
    },
  },

  SuccessResponse: {
    type: 'object',

    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
    },
  },
};
