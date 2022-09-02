import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Injectable, UnauthorizedException, Logger, ConflictException } from '@nestjs/common';

import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserEntity } from 'src/modules/user/user.entity';
import { LoginCredentials } from '../dto/login-credentials.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterCredentials } from '../dto/register-credentials.dto';
import { UserRepository } from 'src/modules/user/user.repository';


@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(AuthRepository) private _authRepository: AuthRepository,
    @InjectRepository(UserRepository) private _userRepository: UserRepository,
    private jwtService: JwtService,
  ) { }

  async signUp(registerCredentialsDto: RegisterCredentials) {
    const data = await this._userRepository.getUserByPhone(registerCredentialsDto.phone);
    if (data) throw new ConflictException("Número de teléfono en uso");
    return await this._authRepository.signUp(registerCredentialsDto);
  }

  async signIn(loginCredentialsDto: LoginCredentials): Promise<{ accessToken: string }> {
    const username = await this._authRepository.validateUserPassword(loginCredentialsDto);

    if (!username) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

    return { accessToken };
  }

  getAuthenticatedUser(user: UserEntity): UserDto {
    return plainToClass(UserDto, user);
  }
}
