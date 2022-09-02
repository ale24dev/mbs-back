import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    //@Inject(forwardRef(() => AuthService)) private authService: AuthService
  ) { }

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.getAllUsers();
  }

  async getUserById(idUser: number): Promise<UserEntity> {
    return await this.userRepository.getUserById(idUser);
  }

  async getUserByName(username: string): Promise<UserDto> {
    return await this.userRepository.getUserByName(username);
  }

  async getUserByPhone(phone: string) {
    return await this.userRepository.getUserByPhone(phone);
  }
  /*
    async uploadImageToUser(userDto: UserDto, file: any) {
      const user = await this.userRepository.findOne({
        username: userDto.username,
      });
      var pathToFile;
  
      if (!user) throw new NotFoundException();
  
      if(user.image!="no image")
      pathToFile = `./files/${user.image}`;
  
      try {
        fs.unlinkSync(pathToFile);
        //file removed
      } catch (err) {
        console.error(err);
      }
  
      if (file != null) user.image = file.filename;
  
      await this.userRepository.save(user);
     
      
      return user;
    }
  */
  async updateUser(idUser: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    return await this.userRepository.updateUser(idUser, updateUserDto);
  }

  async deleteUser(idUser: number): Promise<any> {
    return await this.userRepository.deleteUser(idUser);
  }
}
