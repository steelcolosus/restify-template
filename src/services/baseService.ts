import { DatabaseProvider } from "../database";
import { Repository, ObjectLiteral, ObjectType, DeepPartial } from "typeorm";

export abstract class BaseService<T> {



    constructor(public clazz: new () => T) {

    }

    private async getRepository() {
        const connection = await DatabaseProvider.getConnection();
        return await connection.getRepository(this.clazz);
    }

    public async getById(id: number): Promise<T> {
        const repository = await this.getRepository();
        return await repository.findOne(id);
    }

    public async save(customer: DeepPartial<T>): Promise<T> {
        const repository = await this.getRepository();
        return await repository.save(customer);
    }
    public async list(): Promise<T[]> {
        const repository = await this.getRepository();
        return await repository.find();
    }

    public async delete(id: number): Promise<boolean> {
        const repository = await this.getRepository();
        let customer = await this.getById(id);
        return await repository.remove(customer) ? true : false;
    }

    public abstract async update(entity: T): Promise<T>;
}