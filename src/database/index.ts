import { PropertyConfig, DatabaseConfig } from './../config/index';
import { Connection, createConnection } from "typeorm";


export class DatabaseProvider {
    private static connection: Connection;
    private static configuration: DatabaseConfig;

    public static configure(config:DatabaseConfig): void {
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

        const { type, host, port, username, password, database, ssl, entities } = DatabaseProvider.configuration;
        DatabaseProvider.connection = await createConnection({
            type, host, port, username, password, database,
            extra: {
                ssl
            },
            migrations: ["migration/*.js"],
            cli: {
                "migrationsDir": "migration"
            },
            entities: [... entities],
            synchronize: true // DO NOT USE IN PRODUCTION
        });

        return DatabaseProvider.connection;
    }

}