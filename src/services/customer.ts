import { DatabaseProvider } from "../database";
import { Customer } from "../model/customer";
import { BaseService } from "./baseService";

export class CustomerService extends BaseService<Customer>{

    public async update(entity: Customer): Promise<Customer> {

        let customer = await super.getById(entity.id);
        Object.assign(customer, entity);
        return await super.save(customer);
    }

}

export const customerService = new CustomerService(Customer);