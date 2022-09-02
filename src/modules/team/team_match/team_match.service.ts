import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TeamMatchRepository } from './team_match.repository';

@Injectable()
export class TeamMatchService {
  @InjectRepository(TeamMatchRepository)
  private readonly _teamMatchRepository: TeamMatchRepository;

  async getTeamsByMatch(idMatch: number) {
    const teams = await this._teamMatchRepository.getTeamsByMatch(idMatch);

    return teams;
  }

  async getMatchsByTeam(idTeam: number) {
    const matchs = await this._teamMatchRepository
      .getMatchsByTeam(idTeam);

    return matchs;
  }
}
