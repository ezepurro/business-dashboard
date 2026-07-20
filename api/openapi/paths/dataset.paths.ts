export const datasetPaths = {
  '/companies/{companyId}/datasets': {
    post: {
      tags: ['Datasets'],

      summary: 'Upload a dataset',

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          in: 'path',
          name: 'companyId',
          description: 'Company identifier',
          required: true,
          schema: {
            type: 'string',
            example: '6872c9c79c78a7ef3d9e1d81',
          },
        },
      ],

      requestBody: {
        required: true,

        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',

              required: ['file'],

              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: 'Dataset uploaded successfully.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Dataset',
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
      },
    },

    get: {
      tags: ['Datasets'],

      summary: 'List datasets',

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          in: 'path',
          name: 'companyId',
          description: 'Company identifier',
          required: true,
          schema: {
            type: 'string',
            example: '6872c9c79c78a7ef3d9e1d81',
          },
        },

        {
          in: 'query',
          name: 'page',
          schema: {
            type: 'integer',
            default: 1,
          },
        },

        {
          in: 'query',
          name: 'limit',
          schema: {
            type: 'integer',
            default: 20,
          },
        },

        {
          in: 'query',
          name: 'search',
          schema: {
            type: 'string',
          },
        },

        {
          in: 'query',
          name: 'status',
          schema: {
            type: 'string',
            enum: ['UPLOADING', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED', 'DELETED'],
          },
        },

        {
          in: 'query',
          name: 'sortBy',
          schema: {
            type: 'string',
            enum: ['createdAt', 'originalFilename', 'size'],
          },
        },

        {
          in: 'query',
          name: 'order',
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
          },
        },
      ],

      responses: {
        200: {
          description: 'Paginated datasets list.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PaginatedDatasets',
              },
            },
          },
        },
      },
    },
  },

  '/companies/{companyId}/datasets/{datasetId}': {
    get: {
      tags: ['Datasets'],

      summary: 'Get dataset by id',

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          in: 'path',
          name: 'companyId',
          required: true,
          description: 'Company identifier',
          schema: {
            type: 'string',
            example: '6872c9c79c78a7ef3d9e1d81',
          },
        },
        {
          in: 'path',
          name: 'datasetId',
          required: true,
          description: 'Dataset identifier',
          schema: {
            type: 'string',
            example: '6872cbf79c78a7ef3d9e23a4',
          },
        },
      ],

      responses: {
        200: {
          description: 'Dataset found.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Dataset',
              },
            },
          },
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
      },
    },

    delete: {
      tags: ['Datasets'],

      summary: 'Delete dataset',

      description: 'Only datasets in "UPLOADED" status can be deleted.',

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          in: 'path',
          name: 'companyId',
          required: true,
          description: 'Company identifier',
          schema: {
            type: 'string',
            example: '6872c9c79c78a7ef3d9e1d81',
          },
        },
        {
          in: 'path',
          name: 'datasetId',
          required: true,
          description: 'Dataset identifier',
          schema: {
            type: 'string',
            example: '6872cbf79c78a7ef3d9e23a4',
          },
        },
      ],

      responses: {
        204: {
          description: 'Dataset deleted successfully.',
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

        409: {
          $ref: '#/components/responses/Conflict',
        },
      },
    },
  },
};
