import { Repository, EntityRepository } from 'typeorm';

import { TeamMatchEntity } from './team_match.entity';

@EntityRepository(TeamMatchEntity)
export class TeamMatchRepository extends Repository<TeamMatchEntity> {

  async getTeamsByMatch(idMatch: number) {
    const teams = await this
      .createQueryBuilder('team_match')
      .leftJoinAndSelect('team_match.team', 'team')
      .leftJoinAndSelect('team_match.match', 'match')
      .leftJoinAndSelect('match.tournament', 'tournament')
      .where('team_match.match.idMatch = :idMatch', { idMatch: idMatch })
      .getMany();

    return teams;
  }

  async getMatchsByTeam(idTeam: number) {
    const matchs = await this
      .createQueryBuilder('team_match')
      .leftJoinAndSelect('team_match.team', 'team')
      .leftJoinAndSelect('team_match.match', 'match')
      .leftJoinAndSelect('match.tournament', 'tournament')
      .where('team_match.team.idTeam = :idTeam', { idTeam: idTeam })
      .getMany();

    return matchs;
  }
}
