import { BaseService } from "../core/services/baseService";
import { User } from "../data/models/User";


export class UserService extends BaseService<User>{
    public async getByUsername(username) {
        const repository = await super.getRepository();
        const dbUser = await repository.findOne({ where: { username: username } });
        return dbUser;
    }
}

export const userService = new UserService(User);