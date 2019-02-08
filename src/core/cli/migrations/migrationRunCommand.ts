import yargs = require("yargs");
import { Connection, createConnection } from "typeorm";
import { appPropertyConfig } from "../../../core/config";
const chalk = require("chalk");

export class MigrationRunCommand implements yargs.CommandModule {

    command = "migration:run";
    describe = "Runs all pending migrations.";
    aliases = "migrations:run";

    builder(args: yargs.Argv) {
        return args
            .option("connection", {
                alias: "c",
                default: "default",
                describe: "Name of the connection on which run a query."
            })
            .option("transaction", {
                alias: "t",
                default: "default",
                describe: "Indicates if transaction should be used or not for migration run. Enabled by default."
            })
            .option("config", {
                alias: "f",
                default: "ormconfig",
                describe: "Name of the file with connection configuration."
            });
    }

    async handler(args: yargs.Arguments) {
        if (args._[0] === "migrations:run") {
            console.log("'migrations:run' is deprecated, please use 'migration:run' instead");
        }

        let connection: Connection | undefined = undefined;
        try {

            const connectionOptions = appPropertyConfig.db;
            Object.assign(connectionOptions, {
                subscribers: [],
                synchronize: false,
                migrationsRun: false,
                dropSchema: false,
                logging: ["query", "error", "schema"]
            });
            connection = await createConnection(connectionOptions);

            const options = {
                transaction: args["t"] === "false" ? false : true
            };
            await connection.runMigrations(options);
            await connection.close();
            // exit process if no errors
            process.exit(0);

        } catch (err) {
            if (connection) await (connection as Connection).close();

            console.log(chalk.black.bgRed("Error during migration run:"));
            console.error(err);
            process.exit(1);
        }
    }

}