import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { PlayerDto } from './dto/player.dto';
import { TeamRepository } from '../team/team/team.repository';
import { PlayerStatsEntity } from './entities/player_stats.entity';
import { PlayerRepository } from './repositories/player.repository';
import { PlayerStatsRepository } from './repositories/player_stats.repository';
import { TeamTournamentRepository } from '../tournament/team_tournament/team_tournament.repository';
import { PlayerUpdateDto } from './dto/player.update.dto';
import { BaseService } from 'src/common/service/base.service';
import { PlayerEntity } from './entities/player.entity';
import { Repository } from 'typeorm';
import { PlayerStatsDto } from './dto/player_stats.dto';

@Injectable()
export class PlayerService extends BaseService<PlayerEntity>{
  getRepository(): Repository<PlayerEntity> {
    return this._playerRepository;
  }


  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;
  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;
  @InjectRepository(PlayerStatsRepository)
  private readonly _playerStatsRepository: PlayerStatsRepository;
  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  async getPlayerByCI(ci: string) {
    return await this._playerRepository.getPlayerByCI(ci);
  }

  async getHistoricStatsOfPlayer(idPlayer: number): Promise<PlayerStatsDto> {
    const historicalStats = await this._playerStatsRepository.getHistoricStatsOfPlayer(
      idPlayer,
    );

    return historicalStats;
  }

  async getStatsOfPlayerByTournament(idPlayer: number, idTournament: number) {
    const playerStats = await this._playerStatsRepository.getStatsOfPlayerByTournament(
      idPlayer,
      idTournament,
    );

    return playerStats;
  }


  /*async getRankScoresByTournament(
    idTournament: number,
  ): Promise<PlayerStatsEntity[]> {
    const rankScores = await this._playerStatsRepository.getRankScoresByTournament(
      idTournament,
    );

    return rankScores;
  }*/
/*
  async getRankAssistByTournament(
    idTournament: number,
  ): Promise<PlayerStatsEntity[]> {
    const rankAssist = await this._playerStatsRepository.getRankAssistByTournament(
      idTournament,
    );

    return rankAssist;
  }*/
  /*async getRankYellowCardByTournament(
    idTournament: number,
  ): Promise<PlayerStatsEntity[]> {
    const rankYellowCard = await this._playerStatsRepository.getRankYellowCardByTournament(
      idTournament,
    );

    return rankYellowCard;
  }*/
  /*async getRankRedCardByTournament(
    idTournament: number,
  ): Promise<PlayerStatsEntity[]> {
    const rankAssist = await this._playerStatsRepository.getRankRedCardByTournament(
      idTournament,
    );

    return rankAssist;
  }
*/
  async createPlayer(playerDto: PlayerDto) {
    return await this._playerRepository.createPlayer(playerDto);
  }

  async updatePlayer(idPlayer: number, playerUpdateDto: PlayerUpdateDto) {
    return await this._playerRepository.updatePlayer(idPlayer, playerUpdateDto)
  }

  async uploadImageToPlayer(idPlayer: number, file: any) {
    return await this._playerRepository.uploadImageToPlayer(idPlayer, file);
  }

  async activatePlayer(idPlayer: number) {
    return await this._playerRepository.activatePlayer(idPlayer);
  }

  async desactivatePlayer(idPlayer: number) {
    return await this._playerRepository.desactivatePlayer(idPlayer);
  }
}
