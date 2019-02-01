export * from './config';

export interface PropertyConfig {
    app:AppConfig,
    db:DatabaseConfig,
    cors:CORSConfig,
    applicationLogging:LoggingConfig,
    jwt:JWTConfig

}

export interface AppConfig {
    name:string,
    port:number,
    environment:string,
    logpath:string,
    globalPath:string
}

export interface DatabaseConfig{
    type:  any,
    database: string,
    username: string,
    password: string,
    host: string,
    port: number,
    ssl: boolean,
    entities:any
}

export interface CORSConfig {
    preflightMaxAge: number,
    origins:any [],
    allowMethods:string [],
    allowHeaders: string[],
    exposeHeaders:string []
}

export interface LoggingConfig{
    file: string,
    level:string,
    console: boolean
}

export interface JWTConfig{
    secret:string
}

