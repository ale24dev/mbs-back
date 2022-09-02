import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

import { BaseService } from 'src/common/service/base.service';
import { BaseController } from 'src/common/controller/base.controller';

import { MatchDto } from './dto/match.dto';
import { MatchEntity, MatchState } from './match.entity';
import { MatchService } from './match.service';
import { ResultMatchDto } from './dto/result.match.dto';

@Controller('api/match')
export class MatchController extends BaseController<MatchEntity>{
  constructor(private readonly _matchService: MatchService) { super(); }

  getService(): BaseService<MatchEntity> {
    return this._matchService;
  }

  @Get('/tournament/:idTournament')
  async getMatchsByTournament(@Param('idTournament') idTournament: number) {
    return await this._matchService.getMatchsByTournament(idTournament);
  }

  @Get('tournament/:idTournament/round/:round')
  async getMatchsByTournamentAndRound(
    @Param('idTournament') idTournament: number,
    @Param('round') round: number,
  ) {
    return await this._matchService.getMatchsByTournamentAndRound(idTournament, round);
  }

  @Post("save")
  async createMatch(
    @Body() matchDto: MatchDto,
    @Body('idHomeTeam') idHomeTeam: number,
    @Body('idAwayTeam') idAwayTeam: number,
    @Body('idTournament') idTournament: number,
  ) {
    return await this._matchService.createMatch(
      matchDto,
      idHomeTeam,
      idAwayTeam,
      idTournament,
    );
  }

  @Patch("/:idMatch")
  async updateMatch(
    @Param("idMatch", ParseIntPipe) idMatch: number,
    @Body() matchDto: MatchDto
  ) {
    return await this._matchService.updateMatch(idMatch, matchDto);
  }

  @Delete("close")
  async closeMatch(
    @Query("match", ParseIntPipe) idMatch: number,
    @Body() resultMatchDto: ResultMatchDto,
  ) {
    return await this._matchService.closeMatch(idMatch, resultMatchDto);
  }
}
