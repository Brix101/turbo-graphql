import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { LoginResponse } from './entities/auth.entity';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findOneByEmail(username);
    if (!user) {
      return null;
    }

    const isVerified = await user.verifyPassword(pass);

    if (!isVerified) {
      return null;
    }

    return omit(user, 'password');
  }

  async login(user: User): Promise<LoginResponse | null> {
    return { accessToken: 'Token', user };
  }
}
