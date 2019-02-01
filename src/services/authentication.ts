import { DatabaseProvider } from "../database";
import { Customer } from "../models/customer";
import { BaseService } from "./baseService";
import { User } from "../models/User";

export class AuthenticationService extends BaseService<User>{
    public async authenticate(user: User): Promise<User> {
        const repository = await super.getRepository();
        return await repository.findOne({where:{username: user.username, password: user.password}});
    }
}

export const authenticationService = new AuthenticationService(User);