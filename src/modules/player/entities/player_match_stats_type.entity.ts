import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { PlayerMatchStatsEntity } from "./player_match_stats.entity";
import { StatisticsTypeEntity } from "src/modules/statistics/statistics_type/statisticts_type.entity";

@Entity({ name: 'player_match_stats_type' })
export class PlayerMatchStatsTypeEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    idPlayerMatchStatsType: number;

    @Column({ nullable: false })
    minute: number

    @ManyToOne((type) => PlayerMatchStatsEntity, (playerMatchStats) => playerMatchStats.idPlayerMatchStats)
    playerMatchStats: PlayerMatchStatsEntity;

    @ManyToOne((type) => StatisticsTypeEntity, (statisticsType) => statisticsType.idStatisticsType)
    statisticsType: StatisticsTypeEntity;
}