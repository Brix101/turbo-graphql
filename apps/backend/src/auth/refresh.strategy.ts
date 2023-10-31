import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { omit } from 'lodash';
import { Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';
import { PayloadObj } from './dto/payload';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: function (req: Request) {
        var token = null;
        if (req && req.cookies) token = req.cookies['x-refresh-token'];
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
      logging: true,
    });
  }

  async validate(payload: PayloadObj): Promise<Partial<User> | null> {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      return null; // Return null if the user doesn't exist
    }

    return omit(user, 'password');
  }
}
