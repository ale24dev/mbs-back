import { Repository, EntityRepository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';

import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {

    async getAllUsers() {
        const users = await this.find();

        return users;
    }

    async getUserById(idUser: number) {
        const user: UserEntity = await this.findOne({ idUser });

        if (!user) throw new NotFoundException();

        return user;
    }

    async getUserByName(username: string) {
        const found: UserEntity = await this.findOne({ username });

        if (!found) throw new NotFoundException();

        return found;
    }

    async getUserByPhone(phone: string) {
        const found: UserEntity = await this.findOne({ phone });

        // if (!found) return false;

        return found;
    }

    async updateUser(idUser: number, updateUserDto: UpdateUserDto) {
        var found = await this.getUserById(idUser);

        try {
            found = await this.merge(found, updateUserDto);
            const result = await this.save(found);
            return result;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async deleteUser(idUser: number) {
        const result = await this.delete(idUser);

        if (result.affected === 0) {
            throw new NotFoundException();
        }

        return Promise.resolve({
            result: result,
            status: 'success',
        });
    }
}
