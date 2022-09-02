import { EntityRepository, Repository } from "typeorm";
import { ConflictException, NotFoundException } from "@nestjs/common";

import { RosterEntity } from "./roster.entity";
import { TeamRepository } from "../team/team.repository";
import { PlayerStatsEntity } from "src/modules/player/entities/player_stats.entity";
import { PlayerRepository } from "src/modules/player/repositories/player.repository";
import { TournamentRepository } from "src/modules/tournament/tournament/tournament.repository";
import { PlayerStatsRepository } from "src/modules/player/repositories/player_stats.repository";
import { TeamTournamentRepository } from "src/modules/tournament/team_tournament/team_tournament.repository";

@EntityRepository(RosterEntity)
export class RosterRepository extends Repository<RosterEntity> {
  async getRostersByPlayer(idPlayer: number, _playerRepository: PlayerRepository) {
    const player = await _playerRepository.getPlayerById(idPlayer);

    if (!player) throw new NotFoundException();

    const roster = await this
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.player', 'player')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .where('player.idPlayer = :idPlayer', { idPlayer: idPlayer })
      .getMany();

    return roster;
  }

  async getRosterHistoryByTeam(idTeam: number, _teamRepository: TeamRepository) {
    const team = await _teamRepository.getTeamById(idTeam);

    if (!team) throw new NotFoundException();

    const roster = await this
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.player', 'player')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .where('team.idTeam = :idTeam', { idTeam: idTeam })
      .getMany();

    return roster;
  }

  async getRosterByPlayerAndTournament(idPlayer: number, idTournament: number, _playerRepository: PlayerRepository, _tournamentRepository: TournamentRepository) {
    const player = await _playerRepository.getPlayerById(idPlayer);

    const tournament = await _tournamentRepository.getTournamentById(idTournament);

    const roster = await this
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.player', 'player')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .where('player.idPlayer = :idPlayer', { idPlayer: idPlayer })
      .andWhere('tournament.idTournament = :idTournament', { idTournament: idTournament })
      .getOne();
    return roster;
  }
  async getRosterByTeamAndTournament(idTeam: number, idTournament: number, _teamRepository: TeamRepository, _tournamentRepository: TournamentRepository) {
    const team = await _teamRepository.getTeamById(idTeam);

    const tournament = await _tournamentRepository.getTournamentById(idTournament);

    const roster = await this
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.player', 'player')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .where('team.idTeam = :idTeam', { idTeam: idTeam })
      .andWhere('tournament.idTournament = :idTournament', { idTournament: idTournament })
      .getMany();

    return roster;
  }

  async getRosterActiveByTeam(idTeam: number, _teamRepository: TeamRepository) {
    const team = await _teamRepository.getTeamById(idTeam);

    if (!team) throw new NotFoundException();

    const roster = await this
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.player', 'player')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .where('team.idTeam = :idTeam', { idTeam: idTeam })
      .andWhere('roster.player_active = TRUE')
      .getMany();

    return roster;
  }

  async addOnePlayerToRoster(idPlayer: number, idTeam: number, idTournament: number, _playerRepository: PlayerRepository, _teamTournamentRepository: TeamTournamentRepository, _playerStatsRepository: PlayerStatsRepository) {
    //**CHECK IF PLAYER INTRODUCED EXISTS */
    const player = await _playerRepository.getPlayerById(idPlayer);

    //**Check if Team is inside Tournament */
    const teamInTournament = await _teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .getOne();
    if (!teamInTournament) throw new NotFoundException("El equipo no está dentro del torneo");
    //**Check if Player is inside in some Roster*/
    const playerRoster = await this
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.player', 'player')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .where('player.idPlayer = :idPlayer', {
        idPlayer: idPlayer,
      })
      .andWhere('tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .andWhere('roster.player_active = TRUE')
      .getOne();
    if (playerRoster) throw new ConflictException("El jugador ya pertenece a otro equipo en el torneo seleccionado");

    //**Check if Player is reAgregate in a same Team*/
    const playerRosterSameTeam = await this
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.player', 'player')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .where('player.idPlayer = :idPlayer', {
        idPlayer: idPlayer,
      })
      .andWhere('tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .andWhere('team.idTeam = :idTeam', {
        idTeam: idTeam,
      })
      .getOne();

    if (playerRosterSameTeam) {
      console.log("Hola");
      playerRosterSameTeam.player_active = true;
      await playerRosterSameTeam.save();
      return playerRosterSameTeam;
    }

    const roster = new RosterEntity();
    roster.team = teamInTournament.team;
    roster.tournament = teamInTournament.tournament;

    roster.player = player;
    const result = await this.save(roster);

    //Create Stats of Player in PlayerStats
    const playerStats = new PlayerStatsEntity();
    playerStats.player = player;
    playerStats.tournament = roster.tournament;

    await _playerStatsRepository.save(playerStats);

    return result;
  }

  async removeOnePlayerOfRoster(idPlayer: number, idTeam: number, idTournament: number) {
    //**Check if Team is inside Tournament */
    const playerRoster = await this
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .leftJoinAndSelect('roster.player', 'player')
      .where('roster.player.idPlayer = :idPlayer', {
        idPlayer: idPlayer,
      })
      .andWhere('roster.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .andWhere('roster.team.idTeam = :idTeam', {
        idTeam: idTeam,
      })
      .andWhere('roster.player_active = TRUE')
      .getOne();

    if (!playerRoster) throw new NotFoundException();
    playerRoster.player_active = false;
    await playerRoster.save();

    return playerRoster;
  }
}