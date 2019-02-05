
import { DeepPartial } from "typeorm";
import { DatabaseProvider } from "../data/database";
import { BaseEntity } from "../data/models/BaseEntity";

export abstract class BaseService<T extends BaseEntity> {

    private clazz: (new () => T)

    constructor(clazz: new () => T) {
        this.clazz = clazz;
    }
    protected async getRepository() {
        const connection = await DatabaseProvider.getConnection();
        return await connection.getRepository(this.clazz);
    }

    public async getById(id: number): Promise<T> {
        const repository = await this.getRepository();
        return await repository.findOne(id);
    }

    public async save(data: DeepPartial<T>): Promise<T> {
        const repository = await this.getRepository();
        return await repository.save(data);
    }

    public async saveAll(...data: DeepPartial<T>[]): Promise<(DeepPartial<T> & T)[]> {
        const repository = await this.getRepository();
        return await repository.save(data);
    }

    public async list(): Promise<T[]> {
        const repository = await this.getRepository();
        return await repository.find();
    }

    public async delete(id: number): Promise<boolean> {
        const repository = await this.getRepository();
        let data = await this.getById(id);
        return await repository.remove(data) ? true : false;
    }

    public async deleteAll(...data: T[]) {
        const repository = await this.getRepository();
        return await repository.remove(data);
    }

    public async update(entity: T): Promise<DeepPartial<T> | T> {
        let data = await this.getById(entity.id);
        Object.assign(data, entity);
        return await this.save(data as any);
    }

    public async clean(): Promise<boolean> {
        const repo = await this.getRepository();

        repo.createQueryBuilder()
            .delete()
            .from(this.clazz)
            .execute();

        const total = await this.list();

        return total.length == 0;
    }
}