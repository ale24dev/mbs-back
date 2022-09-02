import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { classToPlain, Exclude } from 'class-transformer';

@Entity({ name: 'user' })
@Unique(['username', 'phone'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  @Exclude()
  @Column()
  salt: string;

  constructor(
    username: string,
    password: string,
    salt: string,
    phone: string
  ) {
    this.username = username;
    this.password = password;
    this.salt = salt;
    this.phone = phone;
  }

  toJSON() {
    return classToPlain(this);
  }
  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

}
