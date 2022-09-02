import {
    BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TeamTournamentEntity } from '../tournament/team_tournament/team_tournament.entity';

@Entity({ name: 'stats_table' })
export class StatsTableEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  idStatsTable: number;

  @Column({default: 0, nullable: false })
  position: number;

  @Column({default: 0, nullable: false })
  pts: number;

  @Column({default: 0, nullable: false })
  pj: number;

  @Column({default: 0, nullable: false })
  pg: number;

  @Column({default: 0, nullable: false })
  pe: number;

  @Column({default: 0, nullable: false })
  pp: number;

  @Column({default: 0, nullable: false })
  gf: number;

  @Column({default: 0, nullable: false })
  gc: number;

  @Column({default: 0, nullable: false })
  dg: number;

  @OneToMany((type)=> TeamTournamentEntity, (teamTournament)=> teamTournament.idTeamTournament)
  teamTournament: TeamTournamentEntity[];
}
