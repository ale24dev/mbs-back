import { IsString } from 'class-validator';

export class LoginCredentials {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
