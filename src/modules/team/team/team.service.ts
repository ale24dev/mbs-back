import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';


import { TeamDto } from './dto/team.dto';
import { TeamEntity } from './team.entity';
import { TeamRepository } from './team.repository';
import { PlayerRepository } from '../../player/repositories/player.repository';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService extends BaseService<TeamEntity>{
  getRepository(): Repository<TeamEntity> {
    return this._teamRepository;
  }
  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;

  async getAllTeams(): Promise<TeamEntity[]> {
    return await this._teamRepository.getAllTeams();
  }

  async getTeamById(idTeam: number): Promise<TeamEntity> {
    const found: TeamEntity = await this._teamRepository.getTeamById(idTeam);
    return found;
  }
  async getTeamByName(name: string): Promise<TeamEntity> {
    const found: TeamEntity = await this._teamRepository.getTeamByName(name);
    return found;
  }

  async createTeam(teamDto: TeamDto) {
    return await this._teamRepository.createTeam(teamDto);
  }

  async updateTeam(idTeam: number, teamDto: TeamDto) {
    return await this._teamRepository.updateTeam(idTeam, teamDto);
  }

  async uploadImageToTeam(idTeam: number, file: any) {
    return await this._teamRepository.uploadImageToTeam(idTeam, file);
  }

  async desactivateTeam(idTeam: number) {
    return await this._teamRepository.desactivateTeam(idTeam);
  }
}
