import { Connection, createConnection } from "typeorm";
import { Customer } from "../models/customer";
export interface DatabaseConfiguration {
    type: 'postgres';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl?: boolean;
}

export class DatabaseProvider {
    private static connection: Connection;
    private static configuration: DatabaseConfiguration;

    public static configure(config: DatabaseConfiguration): void {
        if (!config) {
            throw new Error('Parameter config not set.');
        }
        DatabaseProvider.configuration = config;
    }

    public static async getConnection(): Promise<Connection> {
        if (DatabaseProvider.connection) {
            return DatabaseProvider.connection;
        }

        if (!DatabaseProvider.configuration) {
            throw new Error('DatabaseProvider is not configured yet.')
        }

        const { type, host, port, username, password, database, ssl } = DatabaseProvider.configuration;
        DatabaseProvider.connection = await createConnection({
            type, host, port, username, password, database,
            extra: {
                ssl
            },
            entities: [Customer],
            synchronize: true // DO NOT USE IN PRODUCTION
        });

        return DatabaseProvider.connection;
    }

}