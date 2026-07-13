export const authPaths = {
  '/auth/register': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      description:
        'Creates a new user account and returns an Access Token. A Refresh Token is stored in an HttpOnly cookie.',

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest',
            },
          },
        },
      },

      responses: {
        201: {
          description: 'User registered successfully',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  accessToken: {
                    $ref: '#/components/schemas/AccessToken',
                  },

                  user: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
        },

        400: {
          $ref: '#/components/responses/BadRequest',
        },

        409: {
          $ref: '#/components/responses/Conflict',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/login': {
    post: {
      tags: ['Authentication'],

      summary: 'Login',

      description:
        'Authenticates a user and returns an Access Token. A Refresh Token is stored in an HttpOnly cookie.',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Login successful',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  accessToken: {
                    $ref: '#/components/schemas/AccessToken',
                  },

                  user: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
        },

        400: {
          $ref: '#/components/responses/BadRequest',
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/refresh': {
    post: {
      tags: ['Authentication'],

      summary: 'Refresh Access Token',

      description:
        'Generates a new Access Token using the Refresh Token stored in the HttpOnly cookie.',

      responses: {
        200: {
          description: 'Token refreshed successfully',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  accessToken: {
                    $ref: '#/components/schemas/AccessToken',
                  },
                },
              },
            },
          },
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/logout': {
    post: {
      tags: ['Authentication'],

      summary: 'Logout',

      description:
        'Invalidates the Refresh Token stored in the database and clears the authentication cookie.',

      security: [
        {
          BearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: 'Logout successful',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
            },
          },
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },
      },
    },
  },

  '/auth/me': {
    get: {
      tags: ['Authentication'],

      summary: 'Current authenticated user',

      description: "Returns the authenticated user's information.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: 'Authenticated user',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  user: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },
      },
    },
  },
};
