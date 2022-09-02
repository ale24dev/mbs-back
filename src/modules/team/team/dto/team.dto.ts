import { IsOptional, IsString } from "class-validator";

export class TeamDto {

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    captain: string;

    @IsOptional()
    @IsString()
    manager: string;

    @IsString()
    equipationColor: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsString()
    town: string;

}
