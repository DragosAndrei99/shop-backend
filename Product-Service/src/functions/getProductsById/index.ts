import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        responses: {
          200: {
            description: 'Succesful API response',
            bodyType: 'Products'
          },
          400: {
            description: 'Bad Request',
            bodyType: 'CustomErr'
          },
          404: {
            description: 'Resource not found',
            bodyType: 'CustomErr'
          }
        }
      },
    },
  ],
};
