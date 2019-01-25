import { DatabaseProvider } from "../database";
import { Repository } from "typeorm";

export abstract class BaseService<T> {

    clazz: { new(): T; };

    private getRepository() {
        return DatabaseProvider.getConnection()
            .then(connection => connection.getRepository(this.clazz));

    }

    public async getById(id: number): Promise<T> {
        return await this.getRepository().then(repo => repo.findOne(id));
    }

}