import swaggerJsdoc from 'swagger-jsdoc';
import { tags } from './components/tags';
import { securitySchemes } from './components/security';
import { commonResponses } from './components/responses';
import { authSchemas } from './schemas/auth.schemas';
import { authPaths } from './paths/auth.paths';
import { companySchemas } from './schemas/company.schemas';
import { companyPaths } from './paths/company.paths';
import { datasetSchemas } from './schemas/dataset.schemas';
import { datasetPaths } from './paths/dataset.paths';

const openApiSpecification = {
  openapi: '3.1.0',

  info: {
    title: 'Business Dashboard API',

    description:
      'REST API for Business Dashboard, a platform for uploading datasets, generating AI-powered analyses, and visualizing business metrics.',

    version: '1.0.0',

    contact: {
      name: 'Ezequiel Purro',
      email: 'ezequiel.purro@gmail.com',
    },

    license: {
      name: 'MIT',
    },
  },

  servers: [
    {
      url: 'http://localhost:3000/api',
    },
  ],

  tags,

  paths: {
    ...authPaths,
    ...companyPaths,
    ...datasetPaths,
  },

  components: {
    securitySchemes,

    schemas: {
      ...authSchemas,
      ...companySchemas,
      ...datasetSchemas,
    },

    responses: {
      ...commonResponses,
    },
  },
};

export default swaggerJsdoc({
  definition: openApiSpecification,
  apis: [],
});
