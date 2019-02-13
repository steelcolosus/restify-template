
import { DeepPartial, EntityManager } from "typeorm";
import { BaseEntity } from "../../data/models/BaseEntity";
import { DatabaseProvider } from "../database";

export abstract class BaseService<T extends BaseEntity> {

    private clazz: (new () => T)

    constructor(clazz: new () => T) {
        this.clazz = clazz;
    }

    public async getConnection() {
        const connection = await DatabaseProvider.getConnection();
        return connection;
    }
    protected async getRepository(entityManager?: EntityManager) {
        if (entityManager) {
            return await entityManager.getRepository(this.clazz);
        }
        const connection = await this.getConnection();
        return await connection.getRepository(this.clazz);
    }
    public async getById(id: number, em?: EntityManager): Promise<T> {
        const repository = await this.getRepository(em);
        return await repository.findOne(id);
    }
    public async save(data: DeepPartial<T>, em?: EntityManager): Promise<T> {
        const repository = await this.getRepository(em);
        return await repository.save(data);
    }
    public async saveAll(data: DeepPartial<T>[], em?: EntityManager): Promise<(DeepPartial<T> & T)[]> {
        const repository = await this.getRepository(em);
        return await repository.save(data);
    }
    public async list(em?: EntityManager): Promise<T[]> {
        const repository = await this.getRepository(em);
        return await repository.find();
    }
    public async delete(id: number, em?: EntityManager): Promise<boolean> {
        const repository = await this.getRepository(em);
        let data = await this.getById(id);
        return await repository.remove(data) ? true : false;
    }
    public async deleteAll(data: T[], em?: EntityManager) {
        const repository = await this.getRepository(em);
        return await repository.remove(data);
    }
    public async update(entity: T, em?: EntityManager): Promise<DeepPartial<T> | T> {
        let data = await this.getById(entity.id, em);
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