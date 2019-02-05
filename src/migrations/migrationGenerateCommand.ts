import { appPropertyConfig } from "../config";
import { Connection, createConnection } from "typeorm";
import { CommandUtils } from "./commandUtils";
import yargs = require("yargs");
const chalk = require("chalk");


export class MigrationGenerateCommand implements yargs.CommandModule {

    command = "migration:generate";
    describe = "Generates a new migration file with sql needs to be executed to update schema.";
    aliases = "migrations:generate";

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
        let connection: Connection | undefined = undefined;

        const timestamp = new Date().getTime();
        const filename = timestamp + "-" + args.name + ".ts";
        let directory = args.dir;

        // if directory is not set then try to open tsconfig and find default path there
        if (!directory) {
            directory = appPropertyConfig.db.cli.migrationsDir;
        }

        try {
            Object.assign(appPropertyConfig.db, {
                synchronize: false,
                migrationsRun: false,
                dropSchema: false,
                logging: false
            });

            connection = await createConnection(appPropertyConfig.db);
            const sqlInMemory = await connection.driver.createSchemaBuilder().log();
            const upSqls: string[] = [], downSqls: string[] = [];

            /*if (connection.driver instanceof MysqlDriver) {
                sqlInMemory.upQueries.forEach(query => {
                    upSqls.push("        await queryRunner.query(\"" + query.replace(new RegExp(`"`, "g"), `\\"`) + "\");");
                });
                sqlInMemory.downQueries.forEach(query => {
                    downSqls.push("        await queryRunner.query(\"" + query.replace(new RegExp(`"`, "g"), `\\"`) + "\");");
                });
            } else {

                sqlInMemory.upQueries.forEach(query => {
                    upSqls.push("        await queryRunner.query(`" + query.replace(new RegExp("`", "g"), "\\`") + "`);");
                });
                sqlInMemory.downQueries.forEach(query => {
                    downSqls.push("        await queryRunner.query(`" + query.replace(new RegExp("`", "g"), "\\`") + "`);");
                });
            }*/
            sqlInMemory.upQueries.forEach(query => {
                upSqls.push("        await queryRunner.query(`" + query.replace(new RegExp("`", "g"), "\\`") + "`);");
            });
            sqlInMemory.downQueries.forEach(query => {
                downSqls.push("        await queryRunner.query(`" + query.replace(new RegExp("`", "g"), "\\`") + "`);");
            });

            if (upSqls.length) {
                if (args.name) {
                    const name: any = args.name
                    const fileContent = MigrationGenerateCommand.getTemplate(name, timestamp, upSqls, downSqls.reverse());
                    const path = process.cwd() + "/" + (directory ? (directory + "/") : "") + filename;
                    await CommandUtils.createFile(path, fileContent);

                    console.log(chalk.green(`Migration ${chalk.blue(path)} has been generated successfully.`));
                } else {
                    console.log(chalk.yellow("Please specify migration name"));
                }
            } else {
                console.log(chalk.yellow(`No changes in database schema were found - cannot generate a migration. To create a new empty migration use "typeorm migration:create" command`));
            }
            await connection.close();


        } catch (err) {
            if (connection) await (connection as Connection).close();
            console.log(chalk.black.bgRed("Error during migration generation:"));
            console.error(err);
            process.exit(1);
        }
    }

    protected static getTemplate(name: string, timestamp: number, upSqls: string[], downSqls: string[]): string {
        return `import {MigrationInterface, QueryRunner} from "typeorm";
            export class ${camelCase(name, true)}${timestamp} implements MigrationInterface {
                public async up(queryRunner: QueryRunner): Promise<any> {
            ${upSqls.join(``)} }
    public async down(queryRunner: QueryRunner): Promise<any> {${downSqls.join(``)}
    }}`;
    }

}
export function camelCase(str: string, firstCapital: boolean = false): string {
    return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
        if (firstCapital === true && offset === 0) return p1;
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
}