import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './dto/login-response.dto';
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
    const payload: PayloadObj = { sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload, {});
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '90d',
    });
    return { accessToken, refreshToken, user };
  }

  async refreshToken(user?: User): Promise<{ accessToken: string } | null> {
    if (user) {
      const payload: PayloadObj = { sub: user.id };

      const accessToken = await this.jwtService.signAsync(payload, {});
      return { accessToken };
    }

    return null;
  }
}
