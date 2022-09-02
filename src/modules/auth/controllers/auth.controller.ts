import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';

import { GetUser } from 'src/common/decorators';
import { AuthGuard } from 'src/common/guards';
import { AuthService } from '../services/auth.service';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserEntity } from 'src/modules/user/user.entity';
import { LoginCredentials } from '../dto/login-credentials.dto';
import { RegisterCredentials } from '../dto/register-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    ) {}

  @Post('/signup')
  signUp(@Body() registerCredentialsDto: RegisterCredentials){
    return this.authService.signUp(registerCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() loginCredentialsDto: LoginCredentials): Promise<{ accessToken: string }> {
    return this.authService.signIn(loginCredentialsDto);
  }

  @Get('/authenticated')
  @UseGuards(AuthGuard)
  getAuthenticatedUser(@GetUser() user: UserEntity):  UserDto {
    return this.authService.getAuthenticatedUser(user);
  }
}
