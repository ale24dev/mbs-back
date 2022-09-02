import * as fs from 'fs';
import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';


import { PlayerDto } from '../dto/player.dto';
import { PlayerEntity } from '../entities/player.entity';
import { PlayerUpdateDto } from '../dto/player.update.dto';
import { PlayerStatsRepository } from './player_stats.repository';
import { MatchStatsEntity } from 'src/modules/matchGame/match_stats/entities/match_stats.entity';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { PlayerMatchStatsEntity } from '../entities/player_match_stats.entity';
import { StatisticsTypeEntity } from 'src/modules/statistics/statistics_type/statisticts_type.entity';
import { MatchStatsDto } from 'src/modules/matchGame/match_stats/dto/match_stats.dto';
import { PlayerStatsTypeRepository } from '../player_stats_type/player_stats_type.repository';
import { PlayerStatsTypeEntity } from '../player_stats_type/player_stats_type.entity';
import { StatisticsTypeRepository } from 'src/modules/statistics/statistics_type/statistics_type.repository';
import { PlayerMatchStatsTypeRepository } from './player_match_stats_type.repository';
import { PlayerMatchStatsTypeEntity } from '../entities/player_match_stats_type.entity';
import { PlayerMatchStatsRepository } from './player_match_stats_repository';

@EntityRepository(PlayerEntity)
export class PlayerRepository extends Repository<PlayerEntity> {

  async getAllPlayers() {
    const players = await this
      .createQueryBuilder('player')
      .orderBy('player.active', 'DESC')
      .addOrderBy('player.name', 'ASC')
      .getMany();

    return players;
  }
  async getPlayerById(idPlayer: number) {
    const player = await this.findOne(idPlayer);

    if (!player) throw new NotFoundException();
    return player;
  }
  async getPlayerByCI(ci: string) {
    const player = await this.findOne({ ci });

    if (!player) throw new NotFoundException();
    return player;
  }

  async getAllPlayersByTeam(idTeam: number) {
    const players = await this.createQueryBuilder('player')
      .leftJoinAndSelect('player.team', 'team')
      .where('player.team.idTeam = :idTeam', { idTeam: idTeam })
      .getMany();

    return players;
  }

  async createPlayer(playerDto: PlayerDto) {

    const player = new PlayerEntity();
    this.merge(player, playerDto);

    try {
      await this.save(player);
      //**Guardar el equipo del jugador */
    } catch (error) {
      if (error.code == '23505')
        throw new ConflictException(
          'Ya existe un jugador con ese carnet de identidad en el sistema',
        );
      else throw new InternalServerErrorException();
    }

    return player;
  }

  async addStatsToPlayer(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    matchStatsDto: MatchStatsDto[],
    tournamentRepository: TournamentRepository,
    playerStatsRepository: PlayerStatsRepository,
    statisticsTypeRepository: StatisticsTypeRepository,
    playerMatchStatsRepository: PlayerMatchStatsRepository
  ) {
    let playerMatchStats: PlayerMatchStatsEntity;

    //*Verificamos si el jugador tiene estadísticas en el partido.
    const playerMStats = await playerMatchStatsRepository.createQueryBuilder("player_match_stats")
      .leftJoin('player_match_stats.player', 'player')
      .leftJoin('player_match_stats.match', 'match')
      .where('match.idMatch = :idMatch', { idMatch: matchStats.match.idMatch })
      .andWhere('player.idPlayer = :idPlayer', { idPlayer: player.idPlayer })
      .getOne();

    if (!playerMStats) {
      const newPlayerMatchStats = new PlayerMatchStatsEntity();
      newPlayerMatchStats.match = matchStats.match;
      newPlayerMatchStats.player = player;
      playerMatchStats = await newPlayerMatchStats.save();
    } else {
      playerMatchStats = playerMStats;
    }

    matchStatsDto.forEach(async matchStatDto => {

      //*Creamos las estadísticas del jugador en el partido.
      const statisticsType = await statisticsTypeRepository.getStatisticByType(matchStatDto.statsType);

      const playerMatchStatsType = new PlayerMatchStatsTypeEntity();
      playerMatchStatsType.statisticsType = statisticsType;
      playerMatchStatsType.minute = matchStatDto.minute;
      playerMatchStatsType.playerMatchStats = playerMatchStats;
      await playerMatchStatsType.save();
    });

    //*Actualizamos las estadísticas del jugador en el torneo.
    const tournament = await tournamentRepository.getTournamentById(matchStats.match.tournament.idTournament);
    const playerStats = await playerStatsRepository
      .createQueryBuilder('player_stats')
      .leftJoin('player_stats.player', 'player')
      .leftJoin('player_stats.tournament', 'tournament')
      .where('player.idPlayer = :idPlayer', {
        idPlayer: player.idPlayer,
      })
      .andWhere('tournament.idTournament = :idTournament', {
        idTournament: tournament.idTournament,
      })
      .getOne();
    console.log(playerStats);

    matchStatsDto.forEach(async (matchStatDto) => {
      const statisticsType = await statisticsTypeRepository.getStatisticByType(matchStatDto.statsType);

      const playerStatsType = new PlayerStatsTypeEntity();
      playerStatsType.minute = matchStatDto.minute;
      playerStatsType.playerStats = playerStats;
      playerStatsType.statisticsType = statisticsType;
      await playerStatsType.save();
    });
  }

  async updatePlayer(idPlayer: number, playerUpdateDto: PlayerUpdateDto) {
    const player = await this.getPlayerById(idPlayer);

    const playerUpdated = this.merge(player, playerUpdateDto);

    try {
      const playerR = await this.save(playerUpdated);
      return playerR;
    } catch (error) {
      if (error.code == '23505')
        throw new ConflictException(
          'Ya existe un jugador con ese carnet de identidad en el sistema',
        );
      else throw new InternalServerErrorException();
    }
  }

  async uploadImageToPlayer(idPlayer: number, file: any) {
    const player = await this.findOne(idPlayer);
    var pathToFile;

    if (!player) throw new NotFoundException();

    if (player.image != "no image" || player.image.length == 0)
      pathToFile = `./files/${player.image}`;

    try {
      fs.unlinkSync(pathToFile);
      //file removed
    } catch (err) {
      console.error(err);
    }

    if (file != null) player.image = file.filename;

    await this.save(player);

    return player;
  }

  async activatePlayer(idPlayer: number) {
    const player = await this.getPlayerById(idPlayer);

    player.active = true;

    this.save(player);
  }
  async desactivatePlayer(idPlayer: number) {
    const player = await this.getPlayerById(idPlayer);

    player.active = false;

    this.save(player);
  }
}
