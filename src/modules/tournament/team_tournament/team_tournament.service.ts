import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TeamTournamentEntity } from './team_tournament.entity';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { TeamTournamentRepository } from './team_tournament.repository';
import { TournamentRepository } from '../tournament/tournament.repository';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { StatsType } from 'src/modules/statistics/statistics_type/statisticts_type.entity';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { PlayerStatsTypeRepository } from 'src/modules/player/player_stats_type/player_stats_type.repository';
import { StatisticsTypeRepository } from 'src/modules/statistics/statistics_type/statistics_type.repository';

@Injectable()
export class TeamTournamentService {
  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(TournamentRepository)
  private readonly _tournamentRepository: TournamentRepository;

  @InjectRepository(StatsTableRepository)
  private readonly _statsTableRepository: StatsTableRepository;

  @InjectRepository(PlayerStatsTypeRepository)
  private readonly _playerStatsTypeRepository: PlayerStatsTypeRepository;

  @InjectRepository(PlayerStatsRepository)
  private readonly _playerStatsRepository: PlayerStatsRepository;

  @InjectRepository(StatisticsTypeRepository)
  private readonly _statisticsTypeRepository: StatisticsTypeRepository;

  async getTableOfTournament(idTournament: number) {
    return await this._teamTournamentRepository.getTableOfTournament(idTournament, this._statsTableRepository);
  }
  //OBTENER LOS EQUIPOS SIN REPETICION PARA SACAR LA TABLA
  getTeamsWithoutRepet(teamTournaments: TeamTournamentEntity[]) {
    var listTeamID: number[] = [];
    let listTeamTournament: TeamTournamentEntity[] = [];
    for (let i = 0; i < teamTournaments.length; i++) {
      if (listTeamID.length == 0) {
        listTeamID.push(teamTournaments[i].team.idTeam);
        listTeamTournament.push(teamTournaments[i]);
      }

      if (!listTeamID.includes(teamTournaments[i].team.idTeam)) {
        listTeamID.push(teamTournaments[i].team.idTeam);
        listTeamTournament.push(teamTournaments[i]);
      }
    }
    return listTeamTournament;
  }

  async getTournamentsByTeam(idTeam: number) {
    return await this._teamTournamentRepository.getTournamentsByTeam(idTeam, this._teamRepository);
  }

  async getTeamsByTournament(idTournament: number) {
    return await this._teamTournamentRepository.getTeamsByTournament(idTournament, this._tournamentRepository);
  }

  async getTeamTournamentByTeamAndTournament(
    idTeam: number,
    idTournament: number,
  ) {
    return await this._teamTournamentRepository.getTeamTournamentByTeamAndTournament(
      idTeam,
      idTournament,

    );
  }
  async getRankingPlayerStats(idTournament: number, statsType: StatsType) {
    return await this._teamTournamentRepository.getRankingPlayerStats(idTournament, statsType, this._playerStatsRepository, this._playerStatsTypeRepository, this._tournamentRepository, this._statisticsTypeRepository);
  }
}
