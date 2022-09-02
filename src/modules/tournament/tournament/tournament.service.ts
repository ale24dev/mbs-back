import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
} from '@nestjs/common';

import { TournamentDto } from './dto/tournament.dto';
import { TournamentRepository } from './tournament.repository';
import { TeamRepository } from '../../team/team/team.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { TeamTournamentRepository } from '../team_tournament/team_tournament.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { BaseService } from 'src/common/service/base.service';
import { TournamentEntity } from './tournament.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TournamentService extends BaseService<TournamentEntity>{
  getRepository(): Repository<TournamentEntity> {
    return this._tournamentRepository;
  }
  @InjectRepository(TournamentRepository)
  private readonly _tournamentRepository: TournamentRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  @InjectRepository(TeamStatsRepository)
  private readonly _teamStatsRepository: TeamStatsRepository;

  async getAllTournaments() {
    return await this._tournamentRepository.getAllTournaments();
  }

  async getTournamentById(idTournament: number) {
    return await this._tournamentRepository.getTournamentById(idTournament);
  }

  async getTournamentsNotFinalized() {
    return await this._tournamentRepository.getTournamentsNotFinalized();
  }

  async createTournament(tournamentDto: TournamentDto) {
    return await this._tournamentRepository.createTournament(tournamentDto);
  }

  async addTeamToTournament(idTeam: number, idTournament: number) {
    return await this._tournamentRepository.addTeamToTournament(idTournament, idTeam, this._teamRepository, this._teamTournamentRepository, this._teamStatsRepository);
  }

  async uploadImageToTournament(idTournament: number, file: any) {
    return await this._tournamentRepository.uploadImageToTournament(idTournament, file);
  }

  async updateTournament(idTournament: number, tournamentDto: TournamentDto) {
    return await this._tournamentRepository.updateTournament(idTournament, tournamentDto);
  }

  async finishTournament(idTournament: number) {
    return await this._tournamentRepository.finishTournament(idTournament);
  }
}
