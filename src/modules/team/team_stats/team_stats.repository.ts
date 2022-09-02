import { Repository, EntityRepository } from 'typeorm';

import { TeamStatsEntity } from './team_stats.entity';
import { RosterRepository } from '../roster/roster.repository';
import { PlayerEntity } from 'src/modules/player/entities/player.entity';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { MatchStatsDto } from 'src/modules/matchGame/match_stats/dto/match_stats.dto';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { MatchStatsEntity } from 'src/modules/matchGame/match_stats/entities/match_stats.entity';
import { StatsType } from 'src/modules/statistics/statistics_type/statisticts_type.entity';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';

@EntityRepository(TeamStatsEntity)
export class TeamStatsRepository extends Repository<TeamStatsEntity> {
  async addStats(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    matchStatsDto: MatchStatsDto[],
    playerRepository: PlayerRepository,
    tournamentRepository: TournamentRepository,
    teamTournamentRepository: TeamTournamentRepository,
    rosterRepository: RosterRepository,
  ) {
    //**Buscando el torneo */
    const tournament = await tournamentRepository.getTournamentById(matchStats.match.tournament.idTournament);

    const roster = await rosterRepository.getRosterByPlayerAndTournament(
      player.idPlayer,
      tournament.idTournament,
      playerRepository,
      tournamentRepository,
    );

    const teamTournament = await teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoin('team_tournament.tournament', 'tournament')
      .leftJoin('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .where('team.idTeam = :idTeam', { idTeam: roster.team.idTeam })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: tournament.idTournament,
      })
      .getOne();

    const teamStats = await this.findOne({
      idTeamStats: teamTournament.team_stats.idTeamStats,
    });
    //*Verificamos el tipo de estadística antes de actualizarla
    matchStatsDto.forEach(matchStatDto => {
      switch (matchStatDto.statsType) {
        case StatsType.GOAL:
          //*Añadimos 1 gol por cada elemento
          teamStats.goal += 1;
          break;

        case StatsType.YELLOW_CARD:
          //*Añadimos 1 tarjeta amarilla por cada elemento
          teamStats.yellow_card += 1;
          break;

        case StatsType.YELLOWRED_CARD:
          //*Añadimos 1 tarjeta amarilla doble por cada elemento
          teamStats.yellow_red_card += 1;
          break;

        case StatsType.RED_CARD:
          //*Añadimos 1 tarjeta roja por cada elemento
          teamStats.red_card += 1;
          break;
      }
    });
    await this.save(teamStats);
  }
}
