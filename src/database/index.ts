import { Connection, createConnection, ConnectionOptions } from "typeorm";
import { logger } from '../lib';


export class DatabaseProvider {
    private static connection: Connection;
    private static configuration: ConnectionOptions;

    public static configure(config: ConnectionOptions): void {
        if (!config) {
            throw new Error('Parameter config not set.');
        }
        if (!DatabaseProvider.connection) {
            DatabaseProvider.configuration = config;
        }
    }

    public static async clean() {
        const connection = await DatabaseProvider.getConnection();
        await connection.close();
        DatabaseProvider.connection = undefined;
        DatabaseProvider.configuration = undefined;
    }

    public static async runMigrations() {
        const connection = await DatabaseProvider.getConnection();
        await connection.runMigrations();
    }

    public static async getConnection(): Promise<Connection> {
        if (DatabaseProvider.connection) {

            return DatabaseProvider.connection;
        }

        if (!DatabaseProvider.configuration) {
            throw new Error('DatabaseProvider is not configured yet.')
        }

        try {
            DatabaseProvider.connection = await createConnection(DatabaseProvider.configuration);
        } catch (error) {
            logger.info('database connection already exist')
            logger.error(error);
        }



        return DatabaseProvider.connection;
    }

}