import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];

    if (!authHeader)
      throw new ForbiddenException("Missing CSRF or Auth token");

    const jwtToken = authHeader.replace("Bearer ", "");
    let user: any;

    try {
      user = jwt.verify(jwtToken, "test-secret");
    } catch (e) {
      throw new ForbiddenException("Invalid JWT token");
    }

    request.user = user;
    return true;
  }
}
