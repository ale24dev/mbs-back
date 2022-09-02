import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

import { TeamMatchService } from "./team_match.service";

@Controller("team_match")
export class TeamMatchController{

    constructor(private readonly _teamMatchService: TeamMatchService){}

    @Get("/team/:idTeam")
    async getMatchsByTeam(
        @Param("idTeam", ParseIntPipe)idTeam: number
    ){
        return await this._teamMatchService.getMatchsByTeam(idTeam);
    }

    @Get("/match/:idMatch")
    async getTeamsByMatch(
        @Param("idMatch", ParseIntPipe)idMatch: number
    ){
        return await this._teamMatchService.getTeamsByMatch(idMatch);
    }
}