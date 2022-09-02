import { IsEnum, IsNumberString, IsOptional } from "class-validator";
import { MatchState } from "../match.entity";

export class ResultMatchDto {
    @IsOptional()
    @IsNumberString()
    awayTeamGoals: number;

    @IsOptional()
    @IsNumberString()
    homeTeamGoals: number

    @IsNumberString()
    winner: number;

    @IsEnum(MatchState)
    state: MatchState
}
