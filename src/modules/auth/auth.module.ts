import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '../user/user.repository';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repositories/auth.repository';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: "topSecret51",
      /*signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRATION_TIME)|| jwtConfig.expiresIn,
      },*/
    }),
    TypeOrmModule.forFeature([AuthRepository, UserRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [
    AuthService,
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
