import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Patch,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { editFileName, imageFileFilter } from 'src/utils/file.upload';


@Controller('user')
export class UserController {
  constructor(private _userService: UserService) { }



  @Get()
  async getUsers() {
    return await this._userService.getUsers();
  }

  @Get('/:idUser')
  async getUserById(@Param('idUser', ParseIntPipe) idUser: number): Promise<UserDto> {
    return await this._userService.getUserById(idUser);
  }

  @Get('/name/:name')
  async getUserByName(@Param('name') name: string): Promise<UserDto> {
    return await this._userService.getUserByName(name);
  }

  @Get('/phone/:phone')
  async getUserByPhone(@Param('phone') phone: string) {
    return await this._userService.getUserByPhone(phone);
  }

  @Patch('/:idUser')
  updateUser1(
    @Param('idUser') idUser: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this._userService.updateUser(idUser, updateUserDto);
  }

  @Delete('/:idUser')
  deleteUser(@Param('idUser', ParseIntPipe) idUser: number): Promise<any> {
    return this._userService.deleteUser(idUser);
  }
}
