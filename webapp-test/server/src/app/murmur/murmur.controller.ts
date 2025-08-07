import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Get,
  Query,
  Patch,
} from "@nestjs/common";
import { MurmurService } from "./murmur.service";
import { CreateMurmurDto } from "./dto/murmur.dto";
import { AuthGuard } from "../../guards/auth-guard";
import { GetIssuer } from "../../common/decorators/get-issuer.decorator";
import { getIssuer } from "../../common/dtos/index.dto";
import { PaginationDto } from "../../common/dtos/pagination.dto";

@Controller("murmurs")
@UseGuards(AuthGuard)
export class MurmurController {
  constructor(private readonly murmurService: MurmurService) {}

  @Post()
  create(@GetIssuer() issuer: getIssuer, @Body() dto: CreateMurmurDto) {
    return this.murmurService.createMurmur(issuer.user.sub, dto);
  }

  @Delete(":id")
  delete(@GetIssuer() issuer: getIssuer, @Param("id") id: number) {
    return this.murmurService.deleteMurmur(issuer.user.sub, id);
  }

  @Get()
  list(@GetIssuer() issuer: getIssuer, @Query() pagination: PaginationDto) {
    return this.murmurService.listMurmurs(issuer.user.sub, pagination);
  }

  @Patch(":id/toggle-like")
  toggleLike(@GetIssuer() issuer: getIssuer, @Param("id") id: number) {
    return this.murmurService.toggleLikeMurmur(issuer.user.sub, id);
  }
  @Get("user/:userId")
  getUserMurmurs(
    @Query() pagination: PaginationDto,
    @Param("userId") userId: number,
    @GetIssuer() issuer: getIssuer
  ) {
    return this.murmurService.getMurmursByUser(
      pagination,
      issuer.user.sub,
      userId
    );
  }

  @Get(":id")
  getDetail(@GetIssuer() issuer: getIssuer,@Param("id") id: number) {
    return this.murmurService.getMurmurDetail(issuer.user.sub,id);
  }
}
