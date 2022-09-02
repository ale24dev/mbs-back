import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TeamEntity } from 'src/modules/team/team/team.entity';
import { TournamentEntity } from '../tournament/tournament.entity';
import { StatsTableEntity } from 'src/modules/stats_table/stats_table.entity';
import { TeamStatsEntity } from 'src/modules/team/team_stats/team_stats.entity';

@Entity({ name: 'team_tournament' })
export class TeamTournamentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  idTeamTournament: number;

  @ManyToOne((type) => TeamEntity, (team) => team.idTeam, { eager: true })
  team: TeamEntity

  @ManyToOne((type) => TournamentEntity, (tournament) => tournament.idTournament, { eager: true })
  tournament: TournamentEntity

  @ManyToOne((type) => TeamStatsEntity, (team_stats) => team_stats.idTeamStats, { eager: true })
  team_stats: TeamStatsEntity

  @ManyToOne((type) => StatsTableEntity, (stats_table) => stats_table.idStatsTable, { eager: true })
  stats_table: StatsTableEntity
}
