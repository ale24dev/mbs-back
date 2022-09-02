import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RosterService } from './roster.service';
import { RosterRepository } from './roster.repository';
import { RosterController } from './roster.controller';
import { TeamRepository } from '../team/team.repository';
import { PlayerRepository } from '../../player/repositories/player.repository';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeamRepository,
      RosterRepository,
      PlayerRepository,
      TournamentRepository,
      PlayerStatsRepository,
      TeamTournamentRepository,
    ]),
  ],
  controllers: [RosterController],
  providers: [RosterService],
  exports: [RosterService],
})
export class RosterModule {}
