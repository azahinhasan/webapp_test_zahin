import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateMurmurDto } from "./dto/murmur.dto";
import { Murmur } from "../../entities/murmur.entity";
import { Like } from "../../entities/like.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";

@Injectable()
export class MurmurService {
  constructor(
    @InjectRepository(Murmur)
    private murmurRepo: Repository<Murmur>,
    @InjectRepository(Like)
    private likeRepo: Repository<Like>
  ) {}

  async createMurmur(userId: number, dto: CreateMurmurDto) {
    try {
      const murmur = this.murmurRepo.create({
        content: dto.content,
        user: { id: userId },
      });
      return await this.murmurRepo.save(murmur);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteMurmur(userId: number, murmurId: number) {
    try {
      const murmur = await this.murmurRepo.findOne({
        where: { id: murmurId },
        relations: ["user"],
      });
      if (!murmur) throw new NotFoundException("Murmur not found");
      if (murmur.user.id !== userId)
        throw new ForbiddenException("Cannot delete others murmurs");

      await this.murmurRepo.softDelete(murmurId);
      return { message: "Murmur deleted" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listMurmurs(pagination: PaginationDto) {
    try {
      const { page, limit } = pagination;
      const [data, count] = await this.murmurRepo.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: ["user"],
        order: { createdAt: "DESC" },
      });
      return { data, count };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async likeMurmur(userId: number, murmurId: number) {
    try {
      const existingLike = await this.likeRepo.findOne({
        where: { user: { id: userId }, murmur: { id: murmurId } },
      });
      if (existingLike) throw new ConflictException("Already liked");

      const like = this.likeRepo.create({
        user: { id: userId },
        murmur: { id: murmurId },
      });
      await this.likeRepo.save(like);

      return { message: "Murmur liked" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getMurmursByUser(pagination: PaginationDto, userId: number) {
    try {
      const { page, limit } = pagination;

      const [data, count] = await this.murmurRepo.findAndCount({
        where: { user: { id: userId } },
        order: { createdAt: "DESC" },
        skip: (page - 1) * limit,
        take: limit,
        relations: ["user"],
      });

      return {
        data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getMurmurDetail(murmurId: number) {
    try {
      const murmur = await this.murmurRepo.findOne({
        where: { id: murmurId },
        relations: ["user"],
      });
      if (!murmur) throw new NotFoundException("Murmur not found");

      const likeCount = await this.likeRepo.count({
        where: { murmur: { id: murmurId } },
      });
      return { ...murmur, likeCount };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
