import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: 'Reclaim API',
  environment: process.env.NODE_ENV || 'development',

  apiPrefix: 'api',

  features: {
    logging: true,
    swagger: true,
  },
}));
