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
import { CsrfGuard } from "../../guards/auth-guard";
import { getIssuer } from "../../common/dtos/index.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

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
    return this.userService.getUserInfo(null, issuer.user.sub);
  }

  @Get(":id")
  @UseGuards(CsrfGuard)
  getUserInfo(@GetIssuer() issuer: getIssuer, @Param("id") id: number) {
    return this.userService.getUserInfo(issuer.user.sub, id);
  }

  @Get(":id/following")
  @UseGuards(CsrfGuard)
  getFollowing(
    @GetIssuer() issuer: getIssuer,
    @Param("id") id: number,
    @Query() pagination: PaginationDto
  ) {
    return this.userService.getFollowing(issuer.user.sub, id, pagination);
  }

  @Get(":id/followers")
  @UseGuards(CsrfGuard)
  getFollowers(
    @GetIssuer() issuer: getIssuer,
    @Param("id") id: number,
    @Query() pagination: PaginationDto
  ) {
    return this.userService.getFollowers(issuer.user.sub, id, pagination);
  }
}
