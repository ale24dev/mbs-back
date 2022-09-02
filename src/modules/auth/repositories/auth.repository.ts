import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserDto } from '../../user/dto/user.dto';
import { UserEntity } from '../../user/user.entity';
import { LoginCredentials } from '../dto/login-credentials.dto';
import { RegisterCredentials } from '../dto/register-credentials.dto';

@EntityRepository(UserEntity)
export class AuthRepository extends Repository<UserEntity> {
  private logger = new Logger('AuthRepository');

  async signUp(rCredDto: RegisterCredentials) {
    const { username, password, phone } = rCredDto;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new UserEntity(
      username,
      passwordHash,
      salt,
      phone
    );
    try {
      const registredUser: UserEntity = await this.save(user);

      return registredUser;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('El nombre de usuario esta en uso');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    loginCredentialsDto: LoginCredentials,
  ): Promise<string> {
    const { username, password } = loginCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
