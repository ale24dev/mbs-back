import { MatchStatsEntity } from 'src/modules/matchGame/match_stats/entities/match_stats.entity';
import { PlayerEntity } from 'src/modules/player/entities/player.entity';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { RosterRepository } from 'src/modules/team/roster/roster.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';

export class ValidationPlayer {
  static async checkIfPlayerIsInTeam(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    rosterRepository: RosterRepository,
    tournamentRepository: TournamentRepository
  ) {
    const tournament = await tournamentRepository.getTournamentById(matchStats.match.tournament.idTournament);

    const playerAux = await rosterRepository
    .createQueryBuilder('roster')
    .leftJoinAndSelect('roster.player', 'player')
    .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .where('player.idPlayer = :idPlayer', {
        idPlayer: player.idPlayer,
      })
      .andWhere('tournament.idTournament = :idTournament', {
        idTournament: tournament.idTournament,
      })
      .andWhere('team.idTeam = :idTeam', {
        idTeam: matchStats.team.idTeam,
      })
      .getOne();

    return playerAux ? true : false;
  }
}
