import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { testConnection } from '../shared/databricks-client';

export async function databricksHealth(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Databricks health check invoked');

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  }

  try {
    const isConnected = await testConnection();

    return {
      status: isConnected ? 200 : 503,
      jsonBody: {
        status: isConnected ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        databricks: {
          connected: isConnected,
          host: process.env.DATABRICKS_HOST ? 'configured' : 'missing',
          httpPath: process.env.DATABRICKS_HTTP_PATH ? 'configured' : 'missing',
          token: process.env.DATABRICKS_TOKEN ? 'configured' : 'missing',
        },
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    context.error('Health check failed:', error);

    return {
      status: 503,
      jsonBody: {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  }
}

app.http('databricks-health', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: databricksHealth,
});
