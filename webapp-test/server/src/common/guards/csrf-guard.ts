import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { verifyCsrfToken } from 'src/utils/csrf-token';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const csrfToken = request.headers['x-csrf-token'] as string;
    const authHeader = request.headers['authorization'];

    if (!csrfToken || !authHeader) throw new ForbiddenException('Missing CSRF or Auth token');

    const jwtToken = authHeader.replace('Bearer ', '');
    let user: any;

    try {
      user = jwt.verify(jwtToken, 'test-secret');
    } catch (e) {
      throw new ForbiddenException('Invalid JWT token');
    }

    const isValid = verifyCsrfToken(csrfToken, { id: user.sub, email: user.email });
    if (!isValid) throw new ForbiddenException('Invalid CSRF token');
    console.log(user,'user')
    return true;
  }
}
