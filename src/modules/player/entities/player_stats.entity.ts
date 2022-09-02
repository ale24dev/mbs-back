import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { PlayerEntity } from "./player.entity";
import { TournamentEntity } from "src/modules/tournament/tournament/tournament.entity";
import { PlayerStatsTypeEntity } from "../player_stats_type/player_stats_type.entity";

@Entity({ name: 'player_stats' })
export class PlayerStatsEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  idPlayerStats: number;

  @ManyToOne((type) => PlayerEntity, (player) => player.idPlayer)
  player: PlayerEntity;

  @ManyToOne((type) => TournamentEntity, (tournament) => tournament.idTournament)
  tournament: TournamentEntity;

  @OneToMany((type) => PlayerStatsTypeEntity, (playerStatsType) => playerStatsType.idPlayerStatsType)
  playerStatsType: PlayerStatsTypeEntity[];
}