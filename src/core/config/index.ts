import { ConnectionOptions } from 'typeorm';

export * from './config';

export interface PropertyConfig {
    app: AppConfig,
    db: ConnectionOptions,
    cors: CORSConfig,
    applicationLogging: LoggingConfig,
    jwt: JWTConfig

}

export interface AppConfig {
    name: string,
    port: number,
    environment: string,
    logpath: string,
    globalPath: string,
    appSaltRounds: number
}


export interface CORSConfig {
    preflightMaxAge: number,
    origins: any[],
    allowMethods: string[],
    allowHeaders: string[],
    exposeHeaders: string[]
}

export interface LoggingConfig {
    file: string,
    level: string,
    console: boolean
}

export interface JWTConfig {
    secret: string,
    expiration: string | number
}

