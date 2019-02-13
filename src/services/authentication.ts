
import { BaseService } from "../core/services/baseService";
import * as bcrypt from 'bcrypt'
import { User } from "../data/models/User";
import { PropertyConfig, appPropertyConfig } from "../core/config";
import { UserService, userService } from "./users";


export class AuthenticationService extends BaseService<User>{

    constructor(public userService: UserService, public config: PropertyConfig) {
        super(User);
    }


    public async authenticate(user: User): Promise<User | undefined> {

        const dbUser = await this.userService.getByUsername(user.username);
        if (dbUser) {
            const success = bcrypt.compareSync(user.password, dbUser.password)
            if (success) {
                return dbUser;
            }
        }
        return undefined;
    }



    public async register(user: User): Promise<User | undefined> {

        const dbUser = await this.userService.getByUsername(user.username);

        if (dbUser) {
            return undefined;
        }
        const encPassword = bcrypt.hashSync(user.password, this.config.app.appSaltRounds)
        user.password = encPassword;

        await this.userService.save(user);

        return user;
    }
}

export const authService = new AuthenticationService(userService, appPropertyConfig);
