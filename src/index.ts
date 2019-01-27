import { PingController } from './controllers/ping';
import { CustomerController } from './controllers/customer';
import { ApiServer } from './server';

new ApiServer.Builder(+process.env.PORT || 8080)
  .withDBConfig({
    type: (process.env.DATABASE_TYPE as any) || 'postgres',
    database: process.env.DATABASE_NAME || 'restify',
    username: process.env.DATABASE_USERNAME || 'restify',
    password: process.env.DATABASE_PASSWORD || 'restify',
    host: process.env.DATABASE_HOST || 'localhost',
    port: +process.env.DATABASE_PORT || 5432,
    ssl: !!process.env.USE_SSL
  })
  .withBodyParser()
  .withQueryParser()
  .withResources(
      new CustomerController(), 
      new PingController())
  .build();
