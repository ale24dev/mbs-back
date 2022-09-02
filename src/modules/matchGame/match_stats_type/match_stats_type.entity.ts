import { MatchStatsEntity } from 'src/modules/matchGame/match_stats/entities/match_stats.entity';
import { StatisticsTypeEntity } from 'src/modules/statistics/statistics_type/statisticts_type.entity';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';


@Entity({ name: 'match_stats_type' })
export class MatchStatsTypeEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    idMatchStatsType: number;

    @Column({ nullable: false })
    minute: number

    @ManyToOne((type) => MatchStatsEntity, (matchStats) => matchStats.idMatchStats)
    matchStats: MatchStatsEntity;

    @ManyToOne((type) => StatisticsTypeEntity, (statisticsType) => statisticsType.idStatisticsType)
    statisticsType: StatisticsTypeEntity;
}
