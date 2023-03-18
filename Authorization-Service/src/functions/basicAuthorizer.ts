import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

const { [process.env.MY_GITHUB_ACCOUNT_LOGIN!]: expectedPassword } = process.env;

enum Effect {
  ALLOW = "Allow",
  DENY = "Deny"
}

const generatePolicy = (event: APIGatewayTokenAuthorizerEvent, effect: Effect, principalId : string = '') => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: event.methodArn,
      }],
    },
  };
}
export async function basicAuthorizerFunction(event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> {
  const token = event.authorizationToken.split(' ')[1];

  if (!token) {
    return generatePolicy(event, Effect.DENY); // 401
  }

  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = decoded.split(':');
  console.log(username, password);
  
  if (password !== expectedPassword) {
    return generatePolicy(event, Effect.DENY); // 403
  }

  return generatePolicy(event, Effect.ALLOW, username);
}

