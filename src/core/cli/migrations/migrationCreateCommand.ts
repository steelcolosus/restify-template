
import * as yargs from "yargs";
import { appPropertyConfig } from "../../../core/config";
import { CommandUtils } from "../commandUtils";
import { camelCase } from "./migrationGenerateCommand";
const chalk = require("chalk");

/**
 * Creates a new migration file.
 */
export class MigrationCreateCommand implements yargs.CommandModule {

    command = "migration:create";
    describe = "Creates a new migration file.";
    aliases = "migrations:create";

    builder(args: yargs.Argv) {
        return args
            .option("c", {
                alias: "connection",
                default: "default",
                describe: "Name of the connection on which run a query."
            })
            .option("n", {
                alias: "name",
                describe: "Name of the migration class.",
                demand: true
            })
            .option("d", {
                alias: "dir",
                describe: "Directory where migration should be created."
            })
            .option("f", {
                alias: "config",
                default: "ormconfig",
                describe: "Name of the file with connection configuration."
            });
    }

    async handler(args: yargs.Arguments) {
        if (args._[0] === "migrations:create") {
            console.log("'migrations:create' is deprecated, please use 'migration:create' instead");
        }

        try {
            const timestamp = new Date().getTime();
            const name: any = args.name;
            const fileContent = MigrationCreateCommand.getTemplate(name, timestamp);
            const filename = timestamp + "-" + args.name + ".ts";
            let directory = args.dir;

            // if directory is not set then try to open tsconfig and find default path there
            if (!directory) {
                directory = appPropertyConfig.db.cli.migrationsDir;
            }

            const path = process.cwd() + "/" + (directory ? (directory + "/") : "") + filename;
            await CommandUtils.createFile(path, fileContent);
            console.log(`Migration ${chalk.blue(path)} has been generated successfully.`);

        } catch (err) {
            console.log(chalk.black.bgRed("Error during migration creation:"));
            console.error(err);
            process.exit(1);
        }
    }

    // -------------------------------------------------------------------------
    // Protected Static Methods
    // -------------------------------------------------------------------------

    /**
     * Gets contents of the migration file.
     */
    protected static getTemplate(name: string, timestamp: number): string {
        return `import {MigrationInterface, QueryRunner} from "typeorm";
export class ${camelCase(name, true)}${timestamp} implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}
`;
    }

}