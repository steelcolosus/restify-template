import yargs = require("yargs");

import { Connection, createConnection } from "typeorm";
import { appPropertyConfig } from "../../../core/config";
const chalk = require("chalk");
/**
 * Reverts last migration command.
 */
export class MigrationRevertCommand implements yargs.CommandModule {

    command = "migration:revert";
    describe = "Reverts last executed migration.";
    aliases = "migrations:revert";

    builder(args: yargs.Argv) {
        return args
            .option("c", {
                alias: "connection",
                default: "default",
                describe: "Name of the connection on which run a query."
            })
            .option("transaction", {
                alias: "t",
                default: "default",
                describe: "Indicates if transaction should be used or not for migration revert. Enabled by default."
            })
            .option("f", {
                alias: "config",
                default: "ormconfig",
                describe: "Name of the file with connection configuration."
            });
    }

    async handler(args: yargs.Arguments) {
        if (args._[0] === "migrations:revert") {
            console.log("'migrations:revert' is deprecated, please use 'migration:revert' instead");
        }

        let connection: Connection | undefined = undefined;
        try {

            Object.assign(appPropertyConfig.db, {
                subscribers: [],
                synchronize: false,
                migrationsRun: false,
                dropSchema: false,
                logging: ["query", "error", "schema"]
            });
            connection = await createConnection(appPropertyConfig.db);
            const options = {
                transaction: args["t"] === "false" ? false : true
            };
            await connection.undoLastMigration(options);
            await connection.close();

        } catch (err) {
            if (connection) await (connection as Connection).close();

            console.log(chalk.black.bgRed("Error during migration revert:"));
            console.error(err);
            process.exit(1);
        }
    }

}