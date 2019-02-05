import { BaseService } from "./baseService";
import { User } from "../data/models/User";


export class UserService extends BaseService<User>{
}

export const userService = new UserService(User);