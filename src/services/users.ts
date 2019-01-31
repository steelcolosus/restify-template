import { BaseService } from "./baseService";
import { User } from "../models/User";


export class UserService extends BaseService<User>{
}

export const userService = new UserService(User);