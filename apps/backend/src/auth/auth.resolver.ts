import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { CurrentUser } from './current-user';
import { LoginInput } from './dto/create-auth.input';
import { LoginResponse } from './dto/login-response.dto';
import { GqlAuthGuard } from './gql-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('loginInput') _: LoginInput,
    @Context() ctx: any & { user: User },
  ) {
    const result = await this.authService.login(ctx.user);

    ctx.res.cookie(jwtConstants.cookieKey, result.refreshToken, {
      path: '/', // Replace with your desired path
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: false, // Ensures the cookie is only sent over HTTPS
      // maxAge: 31536000000, // Set the expiration to one year in milliseconds
    });
    return result;
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return this.usersService.findOneById(user.id);
  }
}
