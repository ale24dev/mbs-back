import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { SeasonEntity } from "../season/season.entity";
import { RosterEntity } from "src/modules/team/roster/roster.entity";
import { MatchEntity } from "src/modules/matchGame/match/match.entity";
import { TeamTournamentEntity } from "../team_tournament/team_tournament.entity";
import { PlayerStatsEntity } from "src/modules/player/entities/player_stats.entity";

/**
 * Tipos de torneo existentes.
 */
export enum TournamentType {
  CUP = "Cup",
  LEAGUE = "League"
}

@Entity({ name: 'tournament' })
export class TournamentEntity {

  @PrimaryGeneratedColumn()
  idTournament: number;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: TournamentType,
    nullable: false
  })
  type: TournamentType

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn({ nullable: false })
  created_at: Date

  @Column({ default: true })
  active: boolean;

  @OneToMany((type) => TeamTournamentEntity, (teamTournament) => teamTournament.idTeamTournament)
  teamTournament: TeamTournamentEntity[];

  @OneToMany((type) => PlayerStatsEntity, (player_stats) => player_stats.idPlayerStats)
  player_stats: PlayerStatsEntity[];

  @OneToMany((type) => RosterEntity, (roster) => roster.idRoster)
  roster: RosterEntity[];

  @OneToMany((type) => MatchEntity, (match) => match.idMatch)
  match: MatchEntity[];

  @ManyToOne((type) => SeasonEntity, (season) => season.idSeason, { eager: true })
  season: SeasonEntity
}