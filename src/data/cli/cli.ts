import yargs = require("yargs");
import { MigrationGenerateCommand } from "./migrations/migrationGenerateCommand";
import { MigrationRunCommand } from "./migrations/migrationRunCommand";

yargs.usage("Usage: $0 <command> [options]")
    .command(new MigrationGenerateCommand())
    .command(new MigrationRunCommand())
    .recommendCommands()
    .demandCommand(1)
    .strict()
    .alias("v", "version")
    .help("h")
    .alias("h", "help")
    .argv;