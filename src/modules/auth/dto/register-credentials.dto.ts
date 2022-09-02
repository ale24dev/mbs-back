import { IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterCredentials {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  readonly username: string;

  @IsString()
  readonly phone: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  /*@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })*/
  readonly password: string;
}
