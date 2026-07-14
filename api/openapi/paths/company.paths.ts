export const companyPaths = {
  '/companies': {
    post: {
      tags: ['Companies'],
      summary: 'Create a company',
      description: 'Creates a new company owned by the authenticated user.',

      security: [
        {
          BearerAuth: [],
        },
      ],

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateCompanyRequest',
            },
          },
        },
      },

      responses: {
        201: {
          description: 'Company created successfully',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  company: {
                    $ref: '#/components/schemas/Company',
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

    get: {
      tags: ['Companies'],
      summary: 'List companies',
      description: 'Returns all companies owned by the authenticated user.',

      security: [
        {
          BearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: 'List of companies',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  companies: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Company',
                    },
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

  '/companies/admin': {
    get: {
      tags: ['Companies'],
      summary: 'List all companies (Admin only)',
      description:
        'Returns a paginated list of all companies in the platform, across every owner. Requires the ADMIN role.',

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
        },

        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
        },
      ],

      responses: {
        200: {
          description: 'Paginated list of companies',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  companies: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Company',
                    },
                  },

                  pagination: {
                    $ref: '#/components/schemas/Pagination',
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

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/companies/{id}': {
    get: {
      tags: ['Companies'],
      summary: 'Get a company by ID',
      description: 'Returns a single company owned by the authenticated user.',

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],

      responses: {
        200: {
          description: 'Company found',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  company: {
                    $ref: '#/components/schemas/Company',
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

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        404: {
          $ref: '#/components/responses/NotFound',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },

    patch: {
      tags: ['Companies'],
      summary: 'Update a company',
      description: 'Updates a company owned by the authenticated user.',

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateCompanyRequest',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Company updated successfully',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  company: {
                    $ref: '#/components/schemas/Company',
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

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        404: {
          $ref: '#/components/responses/NotFound',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },

    delete: {
      tags: ['Companies'],
      summary: 'Delete a company',
      description: 'Deletes a company owned by the authenticated user.',

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],

      responses: {
        200: {
          description: 'Company deleted successfully',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
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

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        404: {
          $ref: '#/components/responses/NotFound',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },
};
