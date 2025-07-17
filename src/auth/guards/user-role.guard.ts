import { Reflector } from '@nestjs/core';
import { BadGatewayException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    console.log(user.ci, user.roles);
    if (!user) 
      throw new BadGatewayException('User not found in request');
    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }
    throw new ForbiddenException(
      `User ${user.ci} does not have the necessary roles: ${validRoles.join(', ')}`,
    );
  }
}
