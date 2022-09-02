import { IsNumber, IsNumberString, IsOptional, ValidateNested } from "class-validator";
import { PlayerStatsEntity } from "../entities/player_stats.entity";

/**
 * Clase que contiene las estadísticas de un jugador en determinado torneo.
 */
export class PlayerStatsDto {
    playerStats: PlayerStatsEntity;

    @IsNumber()
    @IsOptional()
    goals: number;

    @IsNumber()
    @IsOptional()
    assists: number;

    @IsNumber()
    @IsOptional()
    yellowCard: number;

    @IsNumber()
    @IsOptional()
    yellowRedCard: number;

    @IsNumber()
    @IsOptional()
    redCard: number;
}
