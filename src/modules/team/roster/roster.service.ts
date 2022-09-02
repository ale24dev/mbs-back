import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RosterRepository } from './roster.repository';
import { TeamRepository } from '../team/team.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';

@Injectable()
export class RosterService {
  @InjectRepository(RosterRepository)
  private readonly _rosterRepository: RosterRepository;

  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;

  @InjectRepository(PlayerStatsRepository)
  private readonly _playerStatsRepository: PlayerStatsRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(TournamentRepository)
  private readonly _tournamentRepository: TournamentRepository;

  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  async getRosterHistoryByTeam(idTeam: number) {
    return this._rosterRepository.getRosterHistoryByTeam(idTeam, this._teamRepository);
  }
  async getRosterByPlayer(idPlayer: number) {
    const roster = await this._rosterRepository.getRostersByPlayer(
      idPlayer,
      this._playerRepository
    );

    return roster;
  }
  async getRosterByPlayerAndTeam(idPlayer: number, idTournament: number) {
    const roster = await this._rosterRepository.getRosterByPlayerAndTournament(
      idPlayer,
      idTournament,
      this._playerRepository,
      this._tournamentRepository,
    );

    return roster;
  }
  async getRosterByTeamAndTournament(idTeam: number, idTournament: number) {
    const roster = await this._rosterRepository.getRosterByTeamAndTournament(
      idTeam,
      idTournament,
      this._teamRepository,
      this._tournamentRepository,
    );

    return roster;
  }
  async getRosterByPlayerAndTournament(idPlayer: number, idTournament: number) {
    const roster = await this._rosterRepository.getRosterByPlayerAndTournament(
      idPlayer,
      idTournament,
      this._playerRepository,
      this._tournamentRepository,
    );

    return roster;
  }

  async getRosterActiveByTeam(idTeam: number) {
    return await this._rosterRepository.getRosterActiveByTeam(idTeam, this._teamRepository);
  }

  async addOnePlayerToRoster(
    idPlayer: number,
    idTeam: number,
    idTournament: number,
  ) {
    return await this._rosterRepository.addOnePlayerToRoster(idPlayer, idTeam, idTournament, this._playerRepository, this._teamTournamentRepository, this._playerStatsRepository);
  }

  async removeOnePlayerOfRoster(
    idPlayer: number,
    idTeam: number,
    idTournament: number,
  ) {
    return await this._rosterRepository.removeOnePlayerOfRoster(idPlayer, idTeam, idTournament);
  }
}
