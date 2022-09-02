import { StatsType } from "src/modules/statistics/statistics_type/statisticts_type.entity";
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsNumberString, ValidateNested } from "class-validator";

export class MatchStatsDto {
    
    @IsEnum(StatsType)
    statsType: StatsType;

    @IsNumberString()
    minute: number;
}
