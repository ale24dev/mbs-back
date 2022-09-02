import * as fs from 'fs';
import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { TeamDto } from './dto/team.dto';
import { TeamEntity } from './team.entity';

@EntityRepository(TeamEntity)
export class TeamRepository extends Repository<TeamEntity> {

  async getAllTeams() {
    const teams = this
      .createQueryBuilder('team')
      .orderBy('team.name', 'ASC')
      .getMany();

    return teams;
  }

  async getTeamById(idTeam: number): Promise<TeamEntity> {
    const found: TeamEntity = await this.findOne({ idTeam });

    if (!found) {
      throw new NotFoundException(`No se encuentra el equipo con id: ${idTeam}`);
    }

    return found;
  }
  async getTeamByName(name: string): Promise<TeamEntity> {
    const found: TeamEntity = await this.findOne({ name });

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async createTeam(teamDto: TeamDto) {


    try {
      const team = new TeamEntity();

      const teamCreated = await this.save(await this.merge(team, teamDto));
      return teamCreated;

    } catch (error) {
      if (error.code == '23505')
        throw new ConflictException(
          'Ya existe un equipo con ese nombre en el sistema',
        );
      else throw new InternalServerErrorException();
    }

  }

  async updateTeam(idTeam: number, teamDto: TeamDto) {

    const team = await this.getTeamById(idTeam);

    const teamUpdated = this.merge(team, teamDto);

    const teamResult = await this.save(teamUpdated);

    return teamResult;
  }

  async uploadImageToTeam(idTeam: number, file: any) {
    const team = await this.getTeamById(idTeam);
    var pathToFile;

    if (team.image != 'no image') {
      pathToFile = `./files/${team.image}`;
    }
    try {
      fs.unlinkSync(pathToFile);
      //file removed
    } catch (err) {
      console.error(err);
    }

    if (file != null) team.image = file.filename;

    await this.save(team);

    return team;
  }

  async desactivateTeam(idTeam: number) {
    const team = await this.getTeamById(idTeam);

    team.active = false;

    return await this.save(team);
  }
}
