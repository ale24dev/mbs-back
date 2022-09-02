import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';

import { TeamTournamentService } from './team_tournament.service';
import { StatsType } from 'src/modules/statistics/statistics_type/statisticts_type.entity';

@Controller('team_tournament')
export class TeamTournamentController {
  constructor(private readonly _teamTournamentService: TeamTournamentService) { }

  @Get('getTournaments')
  async getTournamentsByTeam(@Query('team', ParseIntPipe) idTeam: number) {
    return await this._teamTournamentService.getTournamentsByTeam(idTeam);
  }

  @Get('getTable')
  async getTableofTournament(@Query('tournament', ParseIntPipe) idTournament: number) {
    return await this._teamTournamentService.getTableOfTournament(idTournament);
  }

  @Get('getTeams')
  async getTeamsByTournament(@Query('tournament', ParseIntPipe) idTournament: number) {
    return await this._teamTournamentService.getTeamsByTournament(idTournament);
  }
  /**
   * Obtener el ranking de posiciones en una categoría dada. 
   */
  @Get('getRankingPlayer')
  async getRankingPlayerStats(@Query('statsType') statsType: StatsType, @Query('tournament', ParseIntPipe) idTournament: number) {
    return await this._teamTournamentService.getRankingPlayerStats(idTournament, statsType);
  }
}
