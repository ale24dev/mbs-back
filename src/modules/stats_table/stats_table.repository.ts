import { Repository, EntityRepository } from 'typeorm';
import { StatsTableEntity } from './stats_table.entity';


@EntityRepository(StatsTableEntity)
export class StatsTableRepository extends Repository<StatsTableEntity> {}
