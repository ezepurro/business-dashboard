export const datasetSchemas = {
  Dataset: {
    type: 'object',

    properties: {
      _id: {
        type: 'string',
        example: '6871e4a7d6fd5f37b9c9c0ab',
      },

      company: {
        type: 'string',
        example: '6871e47dd6fd5f37b9c9c02f',
      },

      uploadedBy: {
        type: 'string',
        example: '6871e460d6fd5f37b9c9bff0',
      },

      originalFilename: {
        type: 'string',
        example: 'ventas_2025.xlsx',
      },

      extension: {
        type: 'string',
        example: 'xlsx',
      },

      mimeType: {
        type: 'string',
        example: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },

      size: {
        type: 'integer',
        example: 35214,
      },

      bucket: {
        type: 'string',
        example: 'datasets',
      },

      objectKey: {
        type: 'string',
        example: 'companies/6871e47dd6fd5f37b9c9c02f/6871e4a7d6fd5f37b9c9c0ab.xlsx',
      },

      status: {
        type: 'string',

        enum: ['UPLOADING', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED', 'DELETED'],
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

  PaginatedDatasets: {
    type: 'object',

    properties: {
      data: {
        type: 'array',

        items: {
          $ref: '#/components/schemas/Dataset',
        },
      },

      pagination: {
        type: 'object',

        properties: {
          page: {
            type: 'integer',
            example: 1,
          },

          limit: {
            type: 'integer',
            example: 20,
          },

          total: {
            type: 'integer',
            example: 43,
          },

          totalPages: {
            type: 'integer',
            example: 3,
          },
        },
      },
    },
  },
};
