import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/create-auth.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { LoginResponse } from './dto/login-response.dto';
import { CurrentUser } from './current-user';
import { UsersService } from 'src/users/users.service';
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

    ctx.res.cookie('x-refresh-token', result.refreshToken);
    return result;
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return this.usersService.findOneById(user.id);
  }
}
