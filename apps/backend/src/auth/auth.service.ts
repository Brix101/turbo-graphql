import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './dto/login-response.dto';

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

  async login(user: User): Promise<LoginResponse> {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      {},
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        expiresIn: '90d',
      },
    );
    return { accessToken, refreshToken, user };
  }

  async refreshToken(user?: User): Promise<{ accessToken: string } | null> {
    if (user) {
      const accessToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        {},
      );
      return { accessToken };
    }

    return null;
  }
}
