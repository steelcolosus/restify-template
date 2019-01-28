import { DatabaseProvider } from "../database";
import { Customer } from "../models/customer";
import { BaseService } from "./baseService";

export class CustomerService extends BaseService<Customer>{

}

export const customerService = new CustomerService(Customer);