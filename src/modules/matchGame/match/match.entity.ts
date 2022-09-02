import { PlayerMatchStatsEntity } from "src/modules/player/entities/player_match_stats.entity";
import { TournamentEntity } from "src/modules/tournament/tournament/tournament.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { TeamMatchEntity } from "../../team/team_match/team_match.entity";
import { MatchStatsEntity } from "../match_stats/entities/match_stats.entity";

export enum MatchState {
  FT = 'Match Finished',
  NS = 'Not Started',
  PST = 'Match Postponed',
  FF = 'Forfeit'
}

@Entity({ name: 'match' })
export class MatchEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  idMatch: number;

  @Column({ nullable: true })
  referee: string;

  @Column({ nullable: false })
  round: number;

  // @Column({ type: 'timestamp', nullable: false })
  @Column({ nullable: false })
  timestamp: string;

  @Column({
    type: 'enum',
    enum: MatchState,
    default: MatchState.NS
  })
  state: MatchState;

  @ManyToOne((type) => TournamentEntity, (tournament) => tournament.idTournament, { eager: true })
  tournament: TournamentEntity

  @OneToMany((type) => TeamMatchEntity, (teamMatch) => teamMatch.idTeamMatch)
  teamMatch: TeamMatchEntity[];

  @OneToMany((type) => MatchStatsEntity, (match_stats) => match_stats.idMatchStats)
  match_stats: MatchStatsEntity[];

  @OneToMany((type) => MatchStatsEntity, (match_stats) => match_stats.idMatchStats)
  player_match_stats: PlayerMatchStatsEntity[];
}