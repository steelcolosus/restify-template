import { DatabaseProvider } from "../database";
import { Customer } from "../model/customer";
import { BaseService } from "./baseService";

export class CustomerService extends BaseService<Customer>{


    public async create(customer: Customer): Promise<Customer> {
        const connection = await DatabaseProvider.getConnection();
        return await connection.getRepository(Customer).save(customer);
    }

    public async list(): Promise<Customer[]> {
        const connection = await DatabaseProvider.getConnection();
        return await connection.getRepository(Customer).find();
    }
    public async update(customer: Customer): Promise<Customer> {
        console.log(customer);
        const connection = await DatabaseProvider.getConnection();
        const repository = connection.getRepository(Customer);
        const entity = await repository.findOne(customer.id);

        entity.firstName = customer.firstName;
        entity.lastName = customer.lastName;

        return await repository.save(entity);
    }

    public async delete(id: number): Promise<boolean> {
        const connection = await DatabaseProvider.getConnection();
        let customer = await this.getById(id);
        return await connection.getRepository(Customer).remove(customer) ? true : false;
    }

}

export const customerService = new CustomerService();