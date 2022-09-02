import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchService } from './match.service';
import { MatchRepository } from './match.repository';
import { MatchController } from './match.controller';
import { TeamRepository } from '../../team/team/team.repository';
import { TeamMatchRepository } from '../../team/team_match/team_match.repository';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';
import { MatchStatsRepository } from '../match_stats/repository/match_stats.repository';
import { TournamentRepository } from '../../tournament/tournament/tournament.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';


@Module({
  imports: [TypeOrmModule.forFeature([ MatchRepository, TeamRepository, TeamMatchRepository, TournamentRepository, TeamTournamentRepository, MatchStatsRepository, StatsTableRepository ])],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
