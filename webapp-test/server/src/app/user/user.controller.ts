import { Controller, Post, UseGuards, Body, Param, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { FollowUserDto } from "./dto/user.dto";
import { GetIssuer } from "../../common/decorators/get-issuer.decorator";
import { CsrfGuard } from "../../guards/csrf-guard";
import { getIssuer } from "../../common/dtos/index.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("follow")
  @UseGuards(CsrfGuard)
  follow(@GetIssuer() issuer: getIssuer, @Body() dto: FollowUserDto) {
    return this.userService.toggleFollowUser(issuer.user.sub, dto.targetUserId);
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
