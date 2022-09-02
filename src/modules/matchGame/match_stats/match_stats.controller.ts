import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import { MatchStatsDto } from './dto/match_stats.dto';
import { MatchStatsService } from './match_stats.service';

@Controller('api/match_stats')
export class MatchStatsController {
  constructor(private readonly _matchStatsService: MatchStatsService) { }

  @Get('/match/:idMatch')
  async getStatsByMatch(@Param('idMatch', ParseIntPipe) idMatch: number) {
    return await this._matchStatsService.getStatsByMatch(idMatch);
  }

  @Get('/match-team')
  async getStatsByMatchAndTeam(
    @Query('match', ParseIntPipe) idMatch: number,
    @Query('team', ParseIntPipe) idTeam: number,
  ) {
    return await this._matchStatsService.getStatsByMatchAndTeam(
      idMatch,
      idTeam,
    );
  }

  /*@Get('/:idMatchStats/goals')
  async getGoalsByMatchStats(
    @Param('idMatchStats', ParseIntPipe) idMatchStats: number,
  ) {
    return await this._matchStatsService.getGoalsByMatchStats(idMatchStats);
  }*/

  /*@Post('/match/:idMatch/team/:idTeam')
  async createStatsOfMatch(
    @Param('idMatch', ParseIntPipe) idMatch: number,
    @Param('idTeam', ParseIntPipe) idTeam: number,
  ) {
    return await this._matchStatsService.createStatsOfMatch(
      idMatch,
      idTeam,
    );
  }*/

  @Post('save')
  async addStats(
    @Query('matchStats', ParseIntPipe) idMatchStats: number,
    @Query('player', ParseIntPipe) idPlayer: number,
    @Body(new ParseArrayPipe({ items: MatchStatsDto }))
    matchStatsDto: MatchStatsDto[],
  ) {
    return await this._matchStatsService.addStats(
      idMatchStats,
      idPlayer,
      matchStatsDto,
    );
  }
}
