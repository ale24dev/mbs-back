import { NotFoundException } from "@nestjs/common";
import { FindManyOptions, Repository } from "typeorm";

export abstract class BaseService<T> {
    abstract getRepository(): Repository<T>;

    findAll(): Promise<T[]> {
        return this.getRepository().find();
    }

    async findOne(id: any): Promise<T> {
        const result = await this.getRepository().findOne(id);
        if (!result) throw new NotFoundException(`Not found id: ${id}`);

        return result;
    }

    /* save(entity: T) : Promise<T> {
         return this.getRepository().save(entity);
     }
 
     saveMany(entities: T[]) : Promise<T[]> {
         return this.getRepository().save(entities);
     }
 */
    async delete(id: any) {
        await this.findOne(id);
        await this.getRepository().delete(id);
    }

    count(options?: FindManyOptions<T>): Promise<number> {
        return this.getRepository().count(options);
    }
}