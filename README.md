# api-sdk

An sdk containing shared API modules.


# Fixtures loading 

Some data has to be loaded in order for the application work properly

Fixtures are located inside  `src/fixtures`, you can add your own fixture scripts inside that folder. As an example you can check  *[catalog.ts](https://gitlab.com/asuramedia/api-sdk/blob/develop/src/fixtures/catalogs.ts)*



```typescript

/*...*/
async function companyFixtures() {

    const companyTotal = 5;

    let fixtures: Company[] = [];

    for (let index = 0; index < companyTotal; index++) {
        const company = new Company();
        const id = index + 1;
        company.id = id;
        company.name = faker.company.companyName();
        company.description = faker.company.catchPhrase()
        fixtures.push(company);
        logger.info(`loading company data ${company.id}`)

    }

    await fixtureLoader(fixtures, companyService);
}
/*...*/
```

To mock some data [faker.js](https://github.com/marak/Faker.js/) provides some helpful methods as you can see in the code above



## Usage

At root level run:
```bash

$ npm run fixtures

```

# Migrations
## Creating a new migration

Before creating a new migration you need to setup your connection options properly, located at [src/config/config.ts](https://gitlab.com/asuramedia/api-sdk/blob/develop/src/config/config.ts):

```typescript
/*...*/
    db: {
        name: 'default',
        type: 'postgres',
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST || 'localhost',
        port: +process.env.DB_PORT || 5432,
        logging: true,
        entities: ["src/models/**/*.ts"],
        migrations: ["src/migrations/scripts/**/*.ts"],
        extra: { ssl: false },
        cli: {
            "migrationsDir": "src/migrations/scripts"
        },
        synchronize: true // DO NOT USE IN PRODUCTION,
    },
/*...*/
```
Here we setup three options:

- `"migrationsTableName": "migrations"` - Specify this option only if you need migration table name to be different from "migrations".
- `"migrations": ["src/migrations/scripts/**/*.ts"]` - indicates that typeorm must load migrations from the given "migration" directory.
- `"cli": "migrationsDir": "src/migrations/scripts"` - indicates that the CLI must create new migrations in the "migration" directory.

Once you setup connection options you can create a new migration usinc the following command:

```bash
$ npm run migration:generate -- --n Migration
```

Here, `Migration` is the name of the migration - you can specify any name you want. After you run the command you can see a new file generated in the "src/migrations/scripts" directory named `{TIMESTAMP}-PostRefactoring.ts` where `{TIMESTAMP}` is the current timestamp when the migration was generated. Now you can open the file and add your migration sql queries there.

**The rule of thumb for generating migrations is that you generate them after "each" change you made to your models.**

## Running migrations

Once you have a migration to run on production, you can run them using a the following command:

```bash
$ npm run migration:run
```

This command will execute all pending migrations and run them in a sequence ordered by their timestamps. This means all sql queries written in the up methods of your created migrations will be executed. That's all! Now you have your database schema up-to-date.
