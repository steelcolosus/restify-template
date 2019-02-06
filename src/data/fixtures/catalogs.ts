import { DatabaseProvider } from "../database";
import { appPropertyConfig } from "../../core/config";
import { User } from "../models/User";
import faker = require("faker");
import { logger } from "../../core/lib";
import { authService } from "../../services/authentication";




async function loadFixtures() {

    //DatabaseProvider.configure(appPropertyConfig.db);
    //await registerFakeUsers();
    //await DatabaseProvider.clean();

}

const registerFakeUsers = async () => {
    const userTotal = 12;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    for (let index = 0; index < userTotal; index++) {
        const user = new User();
        const id = index + 1;
        user.id = id;
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.username = `${user.firstName}-${faker.name.jobArea()}`;
        user.description = faker.company.catchPhrase();
        logger.info(`mocking users in /regiser ${user.id}`)
        await authService.register(user);
    }
}



loadFixtures();
