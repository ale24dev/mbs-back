import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";

import { TeamDto } from "./dto/team.dto";
import { TeamService } from "./team.service";
import { editFileName, imageFileFilter } from "src/utils/file.upload";
import { BaseController } from "src/common/controller/base.controller";
import { TeamEntity } from "./team.entity";
import { BaseService } from "src/common/service/base.service";

@Controller("api/team")
export class TeamController extends BaseController<TeamEntity>{

  constructor(private readonly _teamService: TeamService) { super(); }

  getService(): BaseService<TeamEntity> {
    return this._teamService;
  }

  @Get('name/:name')
  async getTeamByName(
    @Param('name') name: string
  ) {
    return await this._teamService.getTeamByName(name);
  }

  @Post("save")
  async createTeam(
    @Body() teamDto: TeamDto
  ) {
    return await this._teamService.createTeam(teamDto);
  }

  @Patch("/:idTeam")
  async updateTeam(
    @Param("idTeam") idTeam: number,
    @Body() teamDto: TeamDto
  ) {
    return await this._teamService.updateTeam(idTeam, teamDto);
  }

  @Post('/:idTeam/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadImageToTeam(
    @Param('idTeam') idTeam: number,
    @UploadedFile() file: any,
  ) {
    return await this._teamService.uploadImageToTeam(idTeam, file);
  }

  @Delete("/:idTeam")
  async desactivateTeam(
    @Param("idTeam") idTeam: number
  ) {
    return await this._teamService.desactivateTeam(idTeam);
  }
}