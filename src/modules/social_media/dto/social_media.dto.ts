import { IsNumber, IsString } from "class-validator";

export class SocialMediaDto {

    @IsString()
    name: string;

    @IsString()
    link: string; 
}
