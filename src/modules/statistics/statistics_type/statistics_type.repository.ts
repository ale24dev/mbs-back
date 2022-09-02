import { HttpException, NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { StatisticsTypeEntity, StatsType } from "./statisticts_type.entity";

@EntityRepository(StatisticsTypeEntity)
export class StatisticsTypeRepository extends Repository<StatisticsTypeEntity> {

    async getStatisticByType(statsType: StatsType) {
        try {
            const statisticsType = await this.findOne({ where: { statsType: statsType } })
            return statisticsType;

        } catch (e) {
            throw new NotFoundException(`La categoría ${statsType}, no esta presente en este torneo`);
        }
        
    }
}