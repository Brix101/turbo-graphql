import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContextHost,
    status: any,
  ) {
    // const { req, res } = context.getArgByIndex(2);
    // const refreshToken = req.cookies[jwtConstants.cookieKey];
    // console.log(info);
    // const decoded = this.jwtService.verify(refreshToken);
    // console.log({ decoded });
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
