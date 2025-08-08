import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      throw new ForbiddenException("Missing CSRF or Auth token");
    }

    const jwtToken = authHeader.replace("Bearer ", "");
    let user: any;

    try {
      const secret = this.configService.get<string>("jwt.secret");
      user = jwt.verify(jwtToken, secret);
    } catch (e) {
      throw new ForbiddenException("Invalid JWT token");
    }

    request.user = user;
    return true;
  }
}
