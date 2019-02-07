import yargs = require("yargs");
import { MigrationGenerateCommand } from "./migrations/migrationGenerateCommand";
import { MigrationRunCommand } from "./migrations/migrationRunCommand";
import { MigrationCreateCommand } from "./migrations/migrationCreateCommand";
import { MigrationRevertCommand } from "./migrations/migrationsRevertCommand";

yargs.usage("Usage: $0 <command> [options]")
    .command(new MigrationGenerateCommand())
    .command(new MigrationRunCommand())
    .command(new MigrationCreateCommand())
    .command(new MigrationRevertCommand())
    .recommendCommands()
    .demandCommand(1)
    .strict()
    .alias("v", "version")
    .help("h")
    .alias("h", "help")
    .argv;