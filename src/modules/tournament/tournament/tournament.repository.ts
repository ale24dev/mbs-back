import * as fs from 'fs';
import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { TournamentDto } from './dto/tournament.dto';
import { TournamentEntity } from './tournament.entity';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { StatsTableEntity } from 'src/modules/stats_table/stats_table.entity';
import { TeamStatsEntity } from 'src/modules/team/team_stats/team_stats.entity';
import { TeamTournamentEntity } from '../team_tournament/team_tournament.entity';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { TeamTournamentRepository } from '../team_tournament/team_tournament.repository';


@EntityRepository(TournamentEntity)
export class TournamentRepository extends Repository<TournamentEntity> {

  async getAllTournaments() {
    const tournaments = await this.find();

    return tournaments;
  }

  async getTournamentById(idTournament: number) {
    const tournament = await this.findOne(idTournament);

    if (!tournament) throw new NotFoundException(`No se encontró el torneo con id: ${idTournament}`);

    return tournament;
  }

  async getTournamentsNotFinalized() {
    const tournaments = await this.find({
      where: { active: true },
    });

    return tournaments;
  }

  async createTournament(tournamentDto: TournamentDto) {

    const tournament = new TournamentEntity();
    const result = await this.save(await this.merge(tournament, tournamentDto));
    return result;
  }
  
  /**
   * Añadir un equipo a un torneo determinado.
   */
  async addTeamToTournament(idTournament: number, idTeam: number, _teamRepository: TeamRepository, _teamTournamentRepository: TeamTournamentRepository, _teamStatsRepository: TeamStatsRepository) {
    const tournament = await this.getTournamentById(
      idTournament,
    );
    //**Comprobar si el torneo esta finalizado
    if (tournament.active) {
      const team = await _teamRepository.getTeamById(idTournament);

      const teamTournament = new TeamTournamentEntity();
      //**Comprobar si el equipo ya esta en el torneo
      const isInside = await _teamTournamentRepository
        .createQueryBuilder('team_tournament')
        .leftJoinAndSelect('team_tournament.team', 'team')
        .leftJoinAndSelect('team_tournament.tournament', 'tournament')
        .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
        .andWhere(
          'team_tournament.tournament.idTournament = :idTournament',
          { idTournament: idTournament },
        )
        .getOne();
      if (!isInside) {
        //**Inicializar las estadisticas de los jugadores en el torneo */
        //  this.initPlayerStats(team, tournament);

        const teamStats = await _teamStatsRepository.save(
          new TeamStatsEntity(),
        );

        teamTournament.team = team;
        teamTournament.tournament = tournament;
        teamTournament.team_stats = teamStats;
        teamTournament.stats_table = await StatsTableEntity.save(
          new StatsTableEntity(),
        );

        const teamTournamentResult = await _teamTournamentRepository.save(
          teamTournament,
        );
        return teamTournamentResult;
      } else throw new ConflictException();

    } else {
      throw new ConflictException("");
    }
  }

  async uploadImageToTournament(idTournament: number, file: any) {
    const tournament = await this.getTournamentById(idTournament);

    var pathToFile;
    if (!tournament) throw new NotFoundException();

    if (tournament.image != 'no image') {
      pathToFile = `./files/${tournament.image}`;
    }
    try {
      fs.unlinkSync(pathToFile);
      //file removed
    } catch (err) {
      console.error(err);
    }

    if (file != null) tournament.image = file.filename;

    await this.save(tournament);

    return tournament;
  }

  async updateTournament(idTournament: number, tournamentDto: TournamentDto) {

    const tournament = await this.getTournamentById(idTournament);

    const tournamentUpdated = this.merge(tournament, tournamentDto);

    const result = await this.save(tournament);

    return result;
  }

  async finishTournament(idTournament: number) {
    const tournament = await this.getTournamentById(idTournament);
    if (tournament) {
      tournament.active = false;
      const result = await this.save(tournament);
      return result;
    }
  }
}
