import {
  Controller,
  UseGuards,
  Param,
  Get,
  Patch,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { GetIssuer } from "../../common/decorators/get-issuer.decorator";
import { AuthGuard } from "../../guards/auth-guard";
import { getIssuer } from "../../common/dtos/index.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(":id/follow")
  @UseGuards(AuthGuard)
  follow(@GetIssuer() issuer: getIssuer, @Param("id") id: number) {
    return this.userService.toggleFollowUser(issuer.user.sub, id);
  }

  @Get("me")
  @UseGuards(AuthGuard)
  getMyInfo(@GetIssuer() issuer: getIssuer) {
    return this.userService.getUserInfo(null, issuer.user.sub);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  getUserInfo(@GetIssuer() issuer: getIssuer, @Param("id") id: number) {
    return this.userService.getUserInfo(issuer.user.sub, id);
  }

  @Get(":id/following")
  @UseGuards(AuthGuard)
  getFollowing(
    @GetIssuer() issuer: getIssuer,
    @Param("id") id: number,
    @Query() pagination: PaginationDto
  ) {
    return this.userService.getFollowing(issuer.user.sub, id, pagination);
  }

  @Get(":id/followers")
  @UseGuards(AuthGuard)
  getFollowers(
    @GetIssuer() issuer: getIssuer,
    @Param("id") id: number,
    @Query() pagination: PaginationDto
  ) {
    return this.userService.getFollowers(issuer.user.sub, id, pagination);
  }
}
