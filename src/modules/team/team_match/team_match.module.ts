import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamMatchService } from './team_match.service';
import { TeamMatchRepository } from './team_match.repository';
import { TeamMatchController } from './team_match.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMatchRepository])],
  controllers: [TeamMatchController],
  providers: [TeamMatchService],
  exports: [TeamMatchService],
})
export class TeamMatchModule {}
