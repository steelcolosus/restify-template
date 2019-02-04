import { DatabaseProvider } from "../database";
import { BaseService } from "./baseService";
import { User } from "../models/User";
import * as bcrypt from 'bcrypt'
import { PropertyConfig, appPropertyConfig } from "../config";
import { config } from "dotenv";


export class AuthenticationService extends BaseService<User>{

    constructor(public config: PropertyConfig) {
        super(User);
    }

    private async getUserByUsername(username) {
        const repository = await super.getRepository();
        const dbUser = await repository.findOne({ where: { username: username } });
        return dbUser;
    }

    public async authenticate(user: User): Promise<User | undefined> {

        const dbUser = await this.getUserByUsername(user.username);
        if (dbUser) {
            const success = bcrypt.compareSync(user.password, dbUser.password)
            if (success) {
                return dbUser;
            }
        }
        return undefined;
    }



    public async register(user: User): Promise<User | undefined> {

        const dbUser = await this.getUserByUsername(user.username);

        if (dbUser) {
            return undefined;
        }
        const encPassword = bcrypt.hashSync(user.password, this.config.app.appSaltRounds)
        user.password = encPassword;

        await super.save(user);

        return user;
    }
}

export const authService = new AuthenticationService(appPropertyConfig);
