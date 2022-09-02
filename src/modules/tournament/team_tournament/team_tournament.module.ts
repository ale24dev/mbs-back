import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamTournamentService } from './team_tournament.service';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { TeamTournamentController } from './team_tournament.controller';
import { TeamTournamentRepository } from './team_tournament.repository';
import { TournamentRepository } from '../tournament/tournament.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';
import { PlayerStatsTypeRepository } from 'src/modules/player/player_stats_type/player_stats_type.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { StatisticsTypeRepository } from 'src/modules/statistics/statistics_type/statistics_type.repository';


@Module({
  imports: [TypeOrmModule.forFeature([TeamTournamentRepository, TeamRepository, TournamentRepository, PlayerStatsTypeRepository, StatsTableRepository, PlayerStatsRepository, StatisticsTypeRepository])],
  controllers: [TeamTournamentController],
  providers: [TeamTournamentService],
  exports: [TeamTournamentService],
})
export class TeamTournamentModule { }
