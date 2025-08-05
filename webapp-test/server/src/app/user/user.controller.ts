import { Controller, Post, UseGuards, Body, Param, Get, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { GetIssuer } from "../../common/decorators/get-issuer.decorator";
import { CsrfGuard } from "../../guards/auth-guard";
import { getIssuer } from "../../common/dtos/index.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(":id/follow")
  @UseGuards(CsrfGuard)
  follow(@GetIssuer() issuer: getIssuer, @Param("id") id: number) {
    return this.userService.toggleFollowUser(issuer.user.sub, id);
  }

  @Get("me")
  @UseGuards(CsrfGuard)
  getMyInfo(@GetIssuer() issuer: getIssuer) {
    return this.userService.getUserInfo(issuer.user.sub);
  }

  @Get(":id")
  getUserInfo(@Param("id") id: number) {
    return this.userService.getUserInfo(id);
  }
}
