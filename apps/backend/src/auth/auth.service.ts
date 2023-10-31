import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { omit } from 'lodash';
import { LoginResponse } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadObj } from './dto/payload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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
    const payload: PayloadObj = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }
}
