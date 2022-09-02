import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TournamentRepository } from './tournament.repository';
import { TeamRepository } from '../../team/team/team.repository';
import { StatsTableEntity } from 'src/modules/stats_table/stats_table.entity';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { TeamTournamentRepository } from '../team_tournament/team_tournament.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeamRepository,
      StatsTableEntity,
      TeamStatsRepository,
      TournamentRepository,
      TeamTournamentRepository,
    ]),
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}
