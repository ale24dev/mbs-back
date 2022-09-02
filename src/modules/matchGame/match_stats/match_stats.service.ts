import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { MatchStatsDto } from './dto/match_stats.dto';
import { MatchRepository } from '../match/match.repository';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { MatchStatsRepository } from './repository/match_stats.repository';
import { RosterRepository } from 'src/modules/team/roster/roster.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { StatisticsTypeRepository } from 'src/modules/statistics/statistics_type/statistics_type.repository';
import { PlayerMatchStatsTypeRepository } from 'src/modules/player/repositories/player_match_stats_type.repository';
import { PlayerMatchStatsRepository } from 'src/modules/player/repositories/player_match_stats_repository';

@Injectable()
export class MatchStatsService {

  @InjectRepository(MatchRepository)
  private readonly _matchRepository: MatchRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(RosterRepository)
  private readonly _rosterRepository: RosterRepository;

  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;


  @InjectRepository(TeamStatsRepository)
  private readonly _teamStatsRepository: TeamStatsRepository;

  @InjectRepository(TournamentRepository)
  private readonly _tournamentRepository: TournamentRepository;

  @InjectRepository(MatchStatsRepository)
  private readonly _matchStatsRepository: MatchStatsRepository;

  @InjectRepository(PlayerStatsRepository)
  private readonly _playerStatsRepository: PlayerStatsRepository;

  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  @InjectRepository(StatisticsTypeRepository)
  private readonly _statisticTypeRepository: StatisticsTypeRepository;

  @InjectRepository(PlayerMatchStatsRepository)
  private readonly _playerMatchStatsRepository: PlayerMatchStatsRepository;

  async getStatsByMatch(idMatch: number) {
    return await this._matchStatsRepository.getStatsByMatch(idMatch, this._matchRepository);
  }

  async getStatsByMatchAndTeam(idMatch: number, idTeam: number) {
    return await this._matchStatsRepository.getStatsByMatchAndTeam(idMatch, idTeam, this._matchRepository);
  }

  async createStatsOfMatch(
    idMatch: number,
    idTeam: number,
  ) {
    return await this._matchStatsRepository.createStatsOfMatch(idMatch, idTeam, this._teamRepository, this._matchRepository);
  }

  async addStats(idMatchStats: number, idPlayer: number, matchStatsDto: MatchStatsDto[]) {
    return await this._matchStatsRepository.addStats(idMatchStats, idPlayer, matchStatsDto, this._playerRepository, this._rosterRepository, this._playerStatsRepository, this._teamStatsRepository, this._tournamentRepository, this._teamTournamentRepository, this._statisticTypeRepository, this._playerMatchStatsRepository,);
  }
}
