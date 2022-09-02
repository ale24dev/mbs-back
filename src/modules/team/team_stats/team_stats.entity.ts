import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { TeamEntity } from "../team/team.entity";
import { TeamTournamentEntity } from "../../tournament/team_tournament/team_tournament.entity";

@Entity({ name: 'team_stats' })
export class TeamStatsEntity {

  @PrimaryGeneratedColumn()
  idTeamStats: number;

  @Column({ default: 0 })
  goal: number;

  @Column({  default: 0 })
  yellow_card: number;

  @Column({  default: 0 })
  yellow_red_card: number;

  @Column({  default: 0 })
  red_card: number;

  @OneToMany((type)=> TeamEntity, (team)=> team.idTeam)
  team: TeamEntity[];

  @OneToMany((type)=> TeamTournamentEntity, (team_tournament)=> team_tournament.idTeamTournament)
  team_tournament: TeamTournamentEntity[];
}