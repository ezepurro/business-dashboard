import swaggerUi from 'swagger-ui-express';

import openApiSpecification from './index';

export const swaggerMiddleware = [
  swaggerUi.serve,

  swaggerUi.setup(openApiSpecification, {
    explorer: true,
  }),
];
