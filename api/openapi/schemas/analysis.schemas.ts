export const analysisSchemas = {
  Analysis: {
    type: 'object',
    required: [
      'id',
      'datasetId',
      'companyId',
      'status',
      'profile',
      'processingTime',
      'pythonVersion',
      'engineVersion',
      'createdAt',
      'updatedAt',
    ],
    properties: {
      id: {
        type: 'string',
        example: '6871e4a7d6fd5f37b9c9c0ab',
      },
      datasetId: {
        type: 'string',
        example: '6871e4a7d6fd5f37b9c9c0ac',
      },
      companyId: {
        type: 'string',
        example: '6871e47dd6fd5f37b9c9c02f',
      },
      status: {
        type: 'string',
        enum: ['PROCESSING', 'SUCCESS', 'FAILED'],
      },
      profile: {
        type: 'object',
        additionalProperties: true,
        nullable: true,
      },
      processingTime: {
        type: 'number',
        nullable: true,
        example: 1842,
      },
      pythonVersion: {
        type: 'string',
        nullable: true,
        example: '3.11.9',
      },
      engineVersion: {
        type: 'string',
        nullable: true,
        example: '1.0.0',
      },
      errorMessage: {
        type: 'string',
        nullable: true,
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

  AnalysisResponse: {
    type: 'object',
    required: ['success', 'analysis'],
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      analysis: {
        $ref: '#/components/schemas/Analysis',
      },
    },
  },

  AnalysesResponse: {
    type: 'object',
    required: ['success', 'analyses'],
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      analyses: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Analysis',
        },
      },
    },
  },
};
