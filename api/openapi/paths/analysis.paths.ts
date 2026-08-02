export const analysisPaths = {
  '/analyses/{id}': {
    get: {
      tags: ['Analysis'],
      summary: 'Get analysis by id',
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'Analysis identifier',
          schema: {
            type: 'string',
            example: '6871e5a7d6fd5f37b9c9dfff',
          },
        },
      ],
      responses: {
        200: {
          description: 'Analysis found.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AnalysisResponse',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/Unauthorized',
        },
        404: {
          $ref: '#/components/responses/NotFound',
        },
      },
    },
  },

  '/datasets/{datasetId}/analysis': {
    get: {
      tags: ['Analysis'],
      summary: 'Get dataset analysis',
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          in: 'path',
          name: 'datasetId',
          required: true,
          description: 'Dataset identifier',
          schema: {
            type: 'string',
            example: '6871e4a7d6fd5f37b9c9c0ac',
          },
        },
      ],
      responses: {
        200: {
          description: 'Analysis found.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AnalysisResponse',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/Unauthorized',
        },
        404: {
          $ref: '#/components/responses/NotFound',
        },
      },
    },
  },

  '/companies/{companyId}/analyses': {
    get: {
      tags: ['Analysis'],
      summary: 'List analyses by company',
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
            example: '6871e47dd6fd5f37b9c9c02f',
          },
        },
      ],
      responses: {
        200: {
          description: 'Analyses found.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AnalysesResponse',
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
  },
};
