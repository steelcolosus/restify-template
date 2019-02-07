import { PropertyConfig } from '.';

import * as dotenv from 'dotenv';

const EnvConfigLoader = (): PropertyConfig => {
    console.log('reading dot env file');
    let path;

    console.log(process.env.NODE_ENV);
    switch (process.env.NODE_ENV) {
        case "test":
            console.log('loading test env file');
            path = `${process.cwd()}/.env.test`;
            break;
        case "production":
            console.log('loading production env file');
            path = `${process.cwd()}/.env.production`;
            break;
        default:
            console.log('loading development env file');
            path = `${process.cwd()}/.env.dev`;
    }

    const result = dotenv.config({ path: path });
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
            globalPath: process.env.APP_GLOBAL_PATH,
            appSaltRounds: +process.env.APP_SALT_ROUNDS || 10
        },
        db: {

            name: process.env.DB_CONNECTION,
            type: process.env.DB_TYPE as any,
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST || 'localhost',
            port: +process.env.DB_PORT || 1433,
            logging: !!process.env.DB_LOGGING || false,
            entities: ["src/data/models/**/*.ts"],
            migrations: ["src/data/migrations/**/*.ts"],
            extra: {
                ssl: false,
                trustedConnection: true
            },
            options: {
                useUTC: true,
                trustedConnection: true
            },
            cli: {
                "migrationsDir": "src/data/migrations/"
            },
            synchronize: !!process.env.DB_SYNCHRONIZE || false// DO NOT USE IN PRODUCTION,
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
