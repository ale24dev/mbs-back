import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { PlayerMatchStatsTypeEntity } from 'src/modules/player/entities/player_match_stats_type.entity';
import { MatchStatsTypeEntity } from 'src/modules/matchGame/match_stats_type/match_stats_type.entity';
import { PlayerStatsTypeEntity } from 'src/modules/player/player_stats_type/player_stats_type.entity';

/**
 * Contiene las diferentes estadísticas que presenta un jugador.
 */
export enum StatsType {
    GOAL = "goals",
    ASSISTS = "assists",
    YELLOW_CARD = "yellow_card",
    YELLOWRED_CARD = "yellow_red_card",
    RED_CARD = "red_card",
}

@Entity({ name: 'statistics_type' })
export class StatisticsTypeEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    idStatisticsType: number;

    @Column({
        type: 'enum',
        enum: StatsType,
        nullable: false
    })
    statsType: StatsType

    @OneToMany((type) => MatchStatsTypeEntity, (matchStatsType) => matchStatsType.idMatchStatsType)
    matchStatsType: MatchStatsTypeEntity[];

    @OneToMany((type) => PlayerMatchStatsTypeEntity, (playerMatchStatsType) => playerMatchStatsType.idPlayerMatchStatsType)
    playerMatchStatsType: PlayerMatchStatsTypeEntity[];

    @OneToMany((type) => PlayerStatsTypeEntity, (playerStatsType) => playerStatsType.idPlayerStatsType)
    playerStatsType: PlayerStatsTypeEntity[];
}
