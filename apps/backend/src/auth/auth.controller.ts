import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user';

@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Get('/refresh_token')
  @UseGuards(AuthGuard(['refresh', 'anonymous']))
  async refreshToken(@CurrentUser() user?: User) {
    return await this.appService.refreshToken(user);
  }
}
