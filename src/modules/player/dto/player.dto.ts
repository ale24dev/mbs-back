import { IsBoolean, IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { PlayerPosition } from "../entities/player.entity";

export class PlayerDto {
    @IsString()
    name: string;

    @IsString()
    last_name: string;

    //@IsNumber()
    @IsNumberString()
    age: number;

    @IsString()
    ci: string;

    //@IsNumber()
    @IsNumberString()
    height: number;

    //@IsNumber()
    @IsNumberString()
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

    @IsEnum(PlayerPosition)
    position: PlayerPosition;

    @IsOptional()
    @IsBoolean()
    active: boolean;
}
