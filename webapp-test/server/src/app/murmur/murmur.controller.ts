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
import { CsrfGuard } from "../../guards/csrf-guard";
import { GetIssuer } from "../../common/decorators/get-issuer.decorator";
import { getIssuer } from "../../common/dtos/index.dto";
import { PaginationDto } from "../../common/dtos/pagination.dto";

@Controller("murmurs")
export class MurmurController {
  constructor(private readonly murmurService: MurmurService) {}

  @Post()
  @UseGuards(CsrfGuard)
  create(@GetIssuer() issuer: getIssuer, @Body() dto: CreateMurmurDto) {
    return this.murmurService.createMurmur(issuer.user.sub, dto);
  }

  @Delete(":id")
  @UseGuards(CsrfGuard)
  delete(@GetIssuer() issuer: getIssuer, @Param("id") id: number) {
    return this.murmurService.deleteMurmur(issuer.user.sub, id);
  }

  @Get()
  list(@Query() pagination: PaginationDto) {
    return this.murmurService.listMurmurs(pagination);
  }

  @Patch(":id/like")
  @UseGuards(CsrfGuard)
  like(@GetIssuer() issuer: getIssuer, @Param("id") id: number) {
    return this.murmurService.likeMurmur(issuer.user.sub, id);
  }

  @Get("me")
  @UseGuards(CsrfGuard)
  myMurmurs(
    @Query() pagination: PaginationDto,
    @GetIssuer() issuer: getIssuer
  ) {
    return this.murmurService.getMurmursByUser(pagination, issuer.user.sub);
  }

  @Get("user/:userId")
  getUserMurmurs(
    @Query() pagination: PaginationDto,
    @Param("userId") userId: number
  ) {
    return this.murmurService.getMurmursByUser(pagination, userId);
  }

  @Get(":id")
  getDetail(@Param("id") id: number) {
    return this.murmurService.getMurmurDetail(id);
  }
}
