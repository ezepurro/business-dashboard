export const companySchemas = {
  Company: {
    type: 'object',
    required: ['id', 'name', 'currency', 'owner', 'createdAt', 'updatedAt'],
    properties: {
      id: {
        type: 'string',
        example: '6842af3d9a6dcbdcb6b8a0df',
      },

      name: {
        type: 'string',
        example: 'Tech Solutions',
      },

      industry: {
        type: 'string',
        nullable: true,
        example: 'Software',
      },

      currency: {
        type: 'string',
        example: 'USD',
      },

      foundedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
      },

      owner: {
        type: 'string',
        example: '6842af3d9a6dcbdcb6b8a0df',
      },

      createdAt: {
        type: 'string',
        format: 'date-time',
      },

      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  CreateCompanyRequest: {
    type: 'object',
    required: ['name'],

    properties: {
      name: {
        type: 'string',
        example: 'Tech Solutions',
      },

      industry: {
        type: 'string',
        nullable: true,
        example: 'Software',
      },

      currency: {
        type: 'string',
        example: 'USD',
      },

      foundedAt: {
        type: 'string',
        format: 'date',
        nullable: true,
        example: '2024-01-15',
      },
    },
  },

  UpdateCompanyRequest: {
    type: 'object',

    properties: {
      name: {
        type: 'string',
        example: 'Tech Solutions',
      },

      industry: {
        type: 'string',
        nullable: true,
        example: 'Software',
      },

      currency: {
        type: 'string',
        example: 'USD',
      },

      foundedAt: {
        type: 'string',
        format: 'date',
        nullable: true,
        example: '2024-01-15',
      },
    },
  },

  Pagination: {
    type: 'object',
    required: ['page', 'limit', 'total', 'totalPages'],

    properties: {
      page: {
        type: 'integer',
        example: 1,
      },

      limit: {
        type: 'integer',
        example: 10,
      },

      total: {
        type: 'integer',
        example: 42,
      },

      totalPages: {
        type: 'integer',
        example: 5,
      },
    },
  },
};
