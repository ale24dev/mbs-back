import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { TeamController } from './team.controller';
import { PlayerRepository } from '../../player/repositories/player.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository, PlayerRepository])],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
