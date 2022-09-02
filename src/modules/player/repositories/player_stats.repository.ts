import { plainToClass } from 'class-transformer';
import { StatsType } from 'src/modules/statistics/statistics_type/statisticts_type.entity';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { Repository, EntityRepository } from 'typeorm';
import { PlayerStatsDto } from '../dto/player_stats.dto';

import { PlayerStatsEntity } from '../entities/player_stats.entity';

@EntityRepository(PlayerStatsEntity)
export class PlayerStatsRepository extends Repository<PlayerStatsEntity> {
  async getHistoricStatsOfPlayer(idPlayer: number): Promise<PlayerStatsDto> {
    const playerStatsDto: PlayerStatsDto = new PlayerStatsDto();

    playerStatsDto.goals = await this.createQueryBuilder('player_stats')
      .leftJoin('player_stats.player', 'player')
      .leftJoin('player_stats.tournament', 'tournament')
      .leftJoin('player_stats.football_statistics', 'football_statistics')
      .leftJoin('football_statistics.statistics_type', 'statistics_type')
      .where('player_stats.player.idPlayer = :idPlayer', { idPlayer: idPlayer })
      .andWhere('statistics_type.statsType =:statsType', { statsType: StatsType.GOAL })
      .getCount();

    playerStatsDto.assists = await this.createQueryBuilder('player_stats')
      .leftJoin('player_stats.player', 'player')
      .leftJoin('player_stats.tournament', 'tournament')
      .leftJoin('player_stats.football_statistics', 'football_statistics')
      .leftJoin('football_statistics.statistics_type', 'statistics_type')
      .where('player_stats.player.idPlayer = :idPlayer', { idPlayer: idPlayer })
      .andWhere('statistics_type.statsType =:statsType', { statsType: StatsType.ASSISTS })
      .getCount();

    playerStatsDto.yellowCard = await this.createQueryBuilder('player_stats')
      .leftJoin('player_stats.player', 'player')
      .leftJoin('player_stats.tournament', 'tournament')
      .leftJoin('player_stats.football_statistics', 'football_statistics')
      .leftJoin('football_statistics.statistics_type', 'statistics_type')
      .where('player_stats.player.idPlayer = :idPlayer', { idPlayer: idPlayer })
      .andWhere('statistics_type.statsType =:statsType', { statsType: StatsType.YELLOW_CARD })
      .getCount();

    playerStatsDto.yellowRedCard = await this.createQueryBuilder('player_stats')
      .leftJoin('player_stats.player', 'player')
      .leftJoin('player_stats.tournament', 'tournament')
      .leftJoin('player_stats.football_statistics', 'football_statistics')
      .leftJoin('football_statistics.statistics_type', 'statistics_type')
      .where('player_stats.player.idPlayer = :idPlayer', { idPlayer: idPlayer })
      .andWhere('statistics_type.statsType =:statsType', { statsType: StatsType.YELLOWRED_CARD })
      .getCount();

    playerStatsDto.redCard = await this.createQueryBuilder('player_stats')
      .leftJoin('player_stats.player', 'player')
      .leftJoin('player_stats.tournament', 'tournament')
      .leftJoin('player_stats.football_statistics', 'football_statistics')
      .leftJoin('football_statistics.statistics_type', 'statistics_type')
      .where('player_stats.player.idPlayer = :idPlayer', { idPlayer: idPlayer })
      .andWhere('statistics_type.statsType =:statsType', { statsType: StatsType.RED_CARD })
      .getCount();

    return playerStatsDto;

  }

  async getStatsOfPlayerByTournament(
    idPlayer: number,
    idTournament: number,
  ): Promise<PlayerStatsEntity> {
    const playerStats = await this.createQueryBuilder('player_stats')
      .leftJoinAndSelect('player_stats.player', 'player')
      .leftJoinAndSelect('player_stats.tournament', 'tournament')
      .where('player_stats.player.idPlayer = :idPlayer', { idPlayer: idPlayer })
      .andWhere('player_stats.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .getOne();

    return playerStats;
  }
  async getStatsPlayersByTournament(
    idTournament: number,
    tournamentRepository: TournamentRepository
  ): Promise<PlayerStatsEntity[]> {
    await tournamentRepository.getTournamentById(idTournament);
    const playerStats = await this.createQueryBuilder('player_stats')
      .leftJoinAndSelect('player_stats.player', 'player')
      .leftJoinAndSelect('player_stats.tournament', 'tournament')
      .where('player_stats.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .getMany();
    return playerStats;
  }

  /*async getRankPlayersByTournament(idTournament: number, statsType: StatsType) {
    const rankScores = await this
      .createQueryBuilder('player_stats')
      .leftJoinAndSelect('player_stats.player', 'player')
      .leftJoinAndSelect('player_stats.tournament', 'tournament')
      .where('player_stats.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .andWhere('player_stats.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      }).orderBy('player_stats.goal', 'DESC')
      .limit(10)
      .getMany();

    return rankScores;
  }*/
}
