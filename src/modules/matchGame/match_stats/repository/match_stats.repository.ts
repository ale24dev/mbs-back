import { Repository, EntityRepository } from 'typeorm';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

import { MatchStatsDto } from '../dto/match_stats.dto';
import { MatchRepository } from '../../match/match.repository';
import { MatchStatsEntity } from '../entities/match_stats.entity';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { ValidationPlayer } from 'src/common/validations/validation.player';
import { RosterRepository } from 'src/modules/team/roster/roster.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { MatchStatsTypeEntity } from '../../match_stats_type/match_stats_type.entity';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { StatisticsTypeEntity, StatsType } from 'src/modules/statistics/statistics_type/statisticts_type.entity';
import { PlayerStatsTypeRepository } from 'src/modules/player/player_stats_type/player_stats_type.repository';
import { StatisticsTypeRepository } from 'src/modules/statistics/statistics_type/statistics_type.repository';
import { PlayerMatchStatsTypeRepository } from 'src/modules/player/repositories/player_match_stats_type.repository';
import { PlayerMatchStatsRepository } from 'src/modules/player/repositories/player_match_stats_repository';

@EntityRepository(MatchStatsEntity)
export class MatchStatsRepository extends Repository<MatchStatsEntity> {

  async getStatsByMatchAndTeam(idMatch: number, idTeam: number, matchRepository: MatchRepository) {
    const match = await matchRepository.findOne(idMatch);

    if (match) {
      const stats = await this
        .createQueryBuilder('match_stats')
        .leftJoinAndSelect('match_stats.team', 'team')
        .leftJoinAndSelect('match_stats.match', 'match')
        .leftJoinAndSelect('match.tournament', 'tournament')
        .where('match_stats.match.idMatch = :idMatch', { idMatch: idMatch })
        .andWhere('match_stats.team.idTeam = :idTeam', { idTeam: idTeam })
        .getOne();

      return stats;
    } else throw new NotFoundException();
  }

  async getStatsByMatch(idMatch: number, _matchRepository: MatchRepository) {
    await _matchRepository.getMatchById(idMatch);

    const stats = await this
      .createQueryBuilder('match_stats')
      .leftJoinAndSelect('match_stats.team', 'team')
      .leftJoinAndSelect('match_stats.match', 'match')
      .where('match.idMatch = :idMatch', { idMatch: idMatch })
      .orderBy('match.idMatch')
      .getMany();

    if (stats.length == 0) throw new HttpException("No content", HttpStatus.NO_CONTENT);
    return stats;
  }

  async createStatsOfMatch(idMatch: number, idTeam: number, _teamRepository: TeamRepository, _matchRepository: MatchRepository) {
    const team = await _teamRepository.findOne(idTeam);
    const match = await _matchRepository.findOne(idMatch);

    //******************************************** */
    //**Verificar si ya el Match tiene 2 equipos */
    //******************************************** */
    const contTeam = await this
      .createQueryBuilder('match_stats')
      .leftJoin('match_stats.match', 'match')
      .where('match_stats.match.idMatch = :idMatch', { idMatch: idMatch })
      .getCount();

    if (match && team && contTeam < 2) {
      const matchStats = new MatchStatsEntity();
      matchStats.match = match;
      matchStats.team = team;

      const matchStatsResult = await this.save(
        matchStats,
      );
      return matchStatsResult;
    } else throw new NotFoundException();
  }

  _playerMatchStatsTypeRepository
  async addStats(idMatchStats: number, idPlayer: number, matchStatsDto: MatchStatsDto[], _playerRepository: PlayerRepository, _rosterRepository: RosterRepository, _playerStatsRepository: PlayerStatsRepository, _teamStatsRepository: TeamStatsRepository, _tournamentRepository: TournamentRepository, _teamTournamentRepository: TeamTournamentRepository, _statisticsTypeRepository: StatisticsTypeRepository, _playerMatchStatsRepository: PlayerMatchStatsRepository) {

    const player = await _playerRepository.findOne(idPlayer);

    const matchStats = await this
      .createQueryBuilder("match_stats")
      .leftJoinAndSelect('match_stats.team', 'team')
      .leftJoinAndSelect('match_stats.match', 'match')
      .leftJoinAndSelect('match.tournament', 'tournament')
      .where('match_stats.idMatchStats = :idMatchStats', { idMatchStats: idMatchStats })
      .getOne();

    //*Se crea una nueva entidad de estadísticas con el tipo correspondiente por cada minuto */   
    matchStatsDto.forEach(async matchStatDto => {

      const statisticsType = await _statisticsTypeRepository.getStatisticByType(matchStatDto.statsType);
      const matchStatsType = new MatchStatsTypeEntity();
      matchStatsType.matchStats = matchStats;
      matchStatsType.statisticsType = statisticsType;
      matchStatsType.minute = matchStatDto.minute;
      await matchStatsType.save();
    });

    if (await ValidationPlayer.checkIfPlayerIsInTeam(
      player,
      matchStats,
      _rosterRepository,
      _tournamentRepository
    )) {

      //************************************************* */
      //**Añadir las estadisticas al jugador */
      //************************************************* */
      await _playerRepository.addStatsToPlayer(
        player,
        matchStats,
        matchStatsDto,
        _tournamentRepository,
        _playerStatsRepository,
        _statisticsTypeRepository,
        _playerMatchStatsRepository
      );

      //************************************************* */
      //**Añadir las estadisticas del equipo */
      //************************************************* */

      await _teamStatsRepository.addStats(
        player,
        matchStats,
        matchStatsDto,
        _playerRepository,
        _tournamentRepository,
        _teamTournamentRepository,
        _rosterRepository
      );

      return matchStats;
    } else throw new NotFoundException(`El jugador no pertenece al equipo: ${matchStats.team.idTeam} en el torneo: ${matchStats.match.tournament.idTournament}`);
  }

  async getGoalsByMatchAndTeam(idMatch: number, idTeam: number) {
    return await this.createQueryBuilder("match_stats")
      .leftJoin('match_stats.team', 'team')
      .leftJoin('match_stats.match', 'match')
      .leftJoin('match_stats.football_statistics', 'football_statistics')
      .leftJoin('football_statistics.statistics_type', 'statistics_type')
      .where('team.idTeam = :idTeam', { idTeam: idTeam })
      .andWhere('match.idMatch = :idMatch', { idMatch: idMatch })
      .andWhere('statistics_type.statsType = :statsType', { statsType: StatsType.GOAL })
      .getCount();
  }
}
