import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { PlayerStatsEntity } from "../entities/player_stats.entity";
import { StatisticsTypeEntity } from "src/modules/statistics/statistics_type/statisticts_type.entity";

@Entity({ name: 'player_stats_type' })
export class PlayerStatsTypeEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    idPlayerStatsType: number;

    @Column({ nullable: false })
    minute: number

    @ManyToOne((type) => PlayerStatsEntity, (playerStats) => playerStats.idPlayerStats, { eager: true })
    playerStats: PlayerStatsEntity;

    @ManyToOne((type) => StatisticsTypeEntity, (statisticsType) => statisticsType.idStatisticsType, { eager: true })
    statisticsType: StatisticsTypeEntity;
}