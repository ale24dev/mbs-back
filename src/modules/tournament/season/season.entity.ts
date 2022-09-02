import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { MatchEntity } from "src/modules/matchGame/match/match.entity";
import { RosterEntity } from "src/modules/team/roster/roster.entity";
import { TeamTournamentEntity } from "../team_tournament/team_tournament.entity";
import { PlayerStatsEntity } from "src/modules/player/entities/player_stats.entity";
import { TournamentEntity } from "../tournament/tournament.entity";

@Entity({ name: 'season' })
export class SeasonEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  idSeason: number;

  @Column({ nullable: false })
  year: number;

  @Column({ nullable: false })
  current: boolean;

  @OneToMany((type) => TournamentEntity, (tournament) => tournament.idTournament)
  tournament: TournamentEntity[];
}