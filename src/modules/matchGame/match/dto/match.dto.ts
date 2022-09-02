import { IsDateString, IsNumber, IsNumberString, IsString } from "class-validator";

export class MatchDto {

    @IsString()
    referee: string;

    @IsNumberString()
    round: number;

    //@IsDateString()
    @IsString()
    timestamp: string
}
