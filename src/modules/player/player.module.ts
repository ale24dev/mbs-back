import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { TeamService } from '../team/team/team.service';
import { TeamRepository } from '../team/team/team.repository';
import { PlayerRepository } from './repositories/player.repository';
import { PlayerStatsRepository } from './repositories/player_stats.repository';
import { TeamTournamentRepository } from '../tournament/team_tournament/team_tournament.repository';


@Module({
  imports: [TypeOrmModule.forFeature([PlayerRepository, TeamRepository, PlayerStatsRepository, TeamTournamentRepository])],
  controllers: [PlayerController],
  providers: [PlayerService, TeamService],
  exports: [PlayerService],
})
export class PlayerModule {}
