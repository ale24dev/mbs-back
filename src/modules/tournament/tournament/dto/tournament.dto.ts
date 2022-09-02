import { IsEnum, IsOptional, IsString } from "class-validator";
import { TournamentType } from "../tournament.entity";

export class TournamentDto {

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsEnum(TournamentType)
    type: TournamentType;
}
