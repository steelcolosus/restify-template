import { User } from './models/User';
import { UserController } from './controllers/user';
import { jwtConfiguration } from './server/index';
import { AuthenticationController } from './controllers/authentication';
import { PingController } from './controllers/ping';
import { ApiServer, HttpMethod, CorsConfiguration } from './server';
import { DatabaseConfiguration } from './database';

const dbConfig: DatabaseConfiguration = {
  type: (process.env.DATABASE_TYPE as any) || 'postgres',
  database: process.env.DATABASE_NAME || 'restify',
  username: process.env.DATABASE_USERNAME || 'restify',
  password: process.env.DATABASE_PASSWORD || 'restify',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 5432,
  ssl: !!process.env.USE_SSL,
  entities: [User]
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
    'Authorization'
  ],
  exposeHeaders: ['Authorization']
};

const config = require('./utils/config')

const rjwt = require('restify-jwt-community');

const globalPath = '/api/v1';

new ApiServer.Builder(+process.env.PORT || 8080)
  .withGlobalPath(globalPath)
  .withDBConfig(dbConfig)
  .withBodyParser()
  .withQueryParser()
  .withCORS(corsConfig)
  .use(rjwt(config.jwt).unless({
      path:[globalPath+"/auth"]
  }))
  .withResources(new AuthenticationController(),new UserController(), new PingController())
  .build();
