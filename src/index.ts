import { PingController } from './controllers/ping';
import { CustomerController } from './controllers/customer';
import { ApiServer, HttpMethod, CorsConfiguration } from './server';
import { DatabaseConfiguration } from './database';

const dbConfig: DatabaseConfiguration = {
  type: (process.env.DATABASE_TYPE as any) || 'postgres',
  database: process.env.DATABASE_NAME || 'restify',
  username: process.env.DATABASE_USERNAME || 'restify',
  password: process.env.DATABASE_PASSWORD || 'restify',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 5432,
  ssl: !!process.env.USE_SSL
};

const corsConfig: CorsConfiguration = {
  preflightMaxAge: 5,
  origins: [
    'http://localhost',
    'http://*.localhost',
    /^http?:\/\/localhost(:[\d]+)?$/
  ],
  allowMethods: [
    HttpMethod.GET,
    HttpMethod.POST,
    HttpMethod.PUT,
    HttpMethod.DELETE,
    HttpMethod.OPTIONS
  ],
  allowHeaders: [
    'Origin',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Content-Type',
    'Date',
    'X-Api-Version',
    'X-Response-Time',
    'X-PINGOTHER',
    'X-CSRF-Token',
    'Authorization',
  ],
  exposeHeaders: ['Authorization']
};

new ApiServer.Builder(+process.env.PORT || 8080)
  .withDBConfig(dbConfig)
  .withBodyParser()
  .withQueryParser()
  .withCORS(corsConfig)
  .withResources(
    new CustomerController(),
    new PingController())
  .build();

