export const commonResponses = {
  Unauthorized: {
    description: 'Unauthorized',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },

  BadRequest: {
    description: 'Bad Request',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },

  Conflict: {
    description: 'Conflict',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },

  Forbidden: {
    description: 'Forbidden',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },

  NotFound: {
    description: 'Not Found',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },

  InternalServerError: {
    description: 'Internal Server Error',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },
};
