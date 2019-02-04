import { PropertyConfig } from '.';

import * as dotenv from 'dotenv';

const EnvConfigLoader = (): PropertyConfig => {
    console.log('reading dot env file');
    const result = dotenv.config();
    if (result.error) {
        throw result.error;
    }

    return AppPropertyConfig();
};

export const AppPropertyConfig = (): PropertyConfig => {
    return {
        app: {
            name: process.env.APP_NAME,
            port: +process.env.APP_PORT || 8080,
            environment: process.env.APPLICATION_ENV,
            logpath: process.env.LOG_PATH,
            globalPath: '/api/v1',
            appSaltRounds: +process.env.APP_SALT_ROUNDS || 10
        },
        db: {
            name: 'default',
            type: 'postgres',
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST || 'localhost',
            port: +process.env.DB_PORT || 5432,
            logging: true,
            entities: ["src/models/**/*.ts"],
            migrations: ["src/migrations/scripts/**/*.ts"],
            extra: { ssl: false },
            cli: {
                "migrationsDir": "src/migrations/scripts"
            },
            synchronize: true // DO NOT USE IN PRODUCTION,
        },
        cors: {
            preflightMaxAge: 5,
            origins: process.env.ALLOWED_HOSTS.split(','),
            allowMethods: process.env.ALLOWED_METHODS.split(','),
            allowHeaders: process.env.ALLOWED_HEADERS.split(','),
            exposeHeaders: process.env.EXPOSED_HEADERS.split(',')
        },
        applicationLogging: {
            file: process.env.LOG_PATH,
            level: process.env.LOG_LEVEL || 'info',
            console: !!process.env.LOG_ENABLE_CONSOLE || true
        },
        jwt: {
            secret: '&@$!asdfasdfasdfasdfasdf!$@&',
            expiration: process.env.JWT_EXPIRATION
        }
    };
};

export const appPropertyConfig = EnvConfigLoader();
