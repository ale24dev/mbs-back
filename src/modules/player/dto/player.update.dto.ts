import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PlayerPosition } from "../entities/player.entity";

export class PlayerUpdateDto {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    last_name: string;

    @IsOptional()
    @IsNumber()
    age: number;

    @IsOptional()
    @IsString()
    ci: string;

    @IsOptional()
    @IsNumber()
    height: number;

    @IsOptional()
    @IsNumber()
    weight: number;

    @IsOptional()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    profession: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsOptional()
    @IsString()
    image_face: string;

    @IsOptional()
    @IsEnum(PlayerPosition)
    position: PlayerPosition;

    @IsOptional()
    @IsBoolean()
    active: boolean;
}
