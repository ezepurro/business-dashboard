import swaggerJsdoc from 'swagger-jsdoc';
import { tags } from './components/tags';
import { securitySchemes } from './components/security';
import { commonResponses } from './components/responses';
import { authSchemas } from './schemas/auth.schemas';
import { authPaths } from './paths/auth.paths';

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
  },

  components: {
    securitySchemes,

    schemas: {
      ...authSchemas,
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
