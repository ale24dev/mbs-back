import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchStatsService } from './match_stats.service';
import { MatchRepository } from '../match/match.repository';
import { MatchStatsController } from './match_stats.controller';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { MatchStatsRepository } from './repository/match_stats.repository';
import { RosterRepository } from 'src/modules/team/roster/roster.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { PlayerMatchStatsRepository } from 'src/modules/player/repositories/player_match_stats_repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { StatisticsTypeRepository } from 'src/modules/statistics/statistics_type/statistics_type.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatchRepository,
      TeamRepository,
      PlayerRepository,
      RosterRepository,
      TeamStatsRepository,
      TournamentRepository,
      MatchStatsRepository,
      PlayerStatsRepository,
      StatisticsTypeRepository,
      TeamTournamentRepository,
      PlayerMatchStatsRepository
    ]),
  ],
  controllers: [MatchStatsController],
  providers: [MatchStatsService],
  exports: [MatchStatsService],
})
export class MatchStatsModule { }
