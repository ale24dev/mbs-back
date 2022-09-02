import { IsNumber, IsString } from "class-validator";

export class TeamTournamentDto {

    @IsNumber()
    position: number;

    @IsNumber()
    pts: number;

    @IsNumber()
    pj: number; 

    @IsNumber()
    pg: number;

    @IsNumber()
    pp: number;
}
