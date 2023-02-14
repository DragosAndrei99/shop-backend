import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        responses: {
          200: {
            description: 'Succesful API response',
            bodyType: 'Product'
          },
          400: {
            description: 'Bad Request',
            bodyType: 'CustomErr'
          },
        },
      },
    },
  ],
};
