import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { PlayerEntity } from "./player.entity";
import { MatchEntity } from "src/modules/matchGame/match/match.entity";
import { PlayerMatchStatsTypeEntity } from "./player_match_stats_type.entity";

@Entity({ name: 'player_match_stats' })
export class PlayerMatchStatsEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    idPlayerMatchStats: number;

    @ManyToOne((type) => PlayerEntity, (player) => player.idPlayer)
    player: PlayerEntity;

    @ManyToOne((type) => MatchEntity, (match) => match.idMatch)
    match: MatchEntity;

    @OneToMany((type) => PlayerMatchStatsTypeEntity, (playerMatchStatsType) => playerMatchStatsType.idPlayerMatchStatsType)
    playerMatchStatsType: PlayerMatchStatsTypeEntity[];
}