import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

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

  async listMurmurs(userId: number, pagination: PaginationDto) {
    try {
      const { page, limit } = pagination;
      let [murmurs, count] = await this.murmurRepo.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: ["user"],
        order: { createdAt: "DESC" },
      });

      const murmurIds = murmurs.map((m) => m.id);
      if (murmurIds.length === 0) {
        return { data: [], count };
      }

      const likes = await this.likeRepo.find({
        where: {
          user: { id: userId },
          murmur: { id: In(murmurIds) },
        },
        relations: ["murmur"],
      });
      const likedMurmurIds = new Set(likes.map((like) => like.murmur.id));

      const data = await Promise.all(
        murmurs.map(async (murmur) => {
          const totalLikes = await this.likeRepo.count({
            where: { murmur: { id: murmur.id } },
          });

          return {
            ...murmur,
            isLiked: likedMurmurIds.has(murmur.id),
            totalLikes,
          };
        })
      );

      return { data, count };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async toggleLikeMurmur(userId: number, murmurId: number) {
    try {
      const existingLike = await this.likeRepo.findOne({
        where: { user: { id: userId }, murmur: { id: murmurId } },
      });

      if (existingLike) {
        await this.likeRepo.remove(existingLike);
        return { message: "Murmur unliked" };
      } else {
        const like = this.likeRepo.create({
          user: { id: userId },
          murmur: { id: murmurId },
        });
        await this.likeRepo.save(like);
        return { message: "Murmur liked" };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getMurmursByUser(
    pagination: PaginationDto,
    userId: number,
    otherUserId: number
  ) {
    try {
      const { page, limit } = pagination;
      let [murmurs, count] = await this.murmurRepo.findAndCount({
        where: { user: { id: otherUserId } },
        order: { createdAt: "DESC" },
        skip: (page - 1) * limit,
        take: limit,
        relations: ["user"],
      });

      if (murmurs.length === 0) {
        return {
          data: [],
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        };
      }

      const murmurIds = murmurs.map((m) => m.id);

      const likes = await this.likeRepo.find({
        where: {
          user: { id: userId },
          murmur: { id: In(murmurIds) },
        },
        relations: ["murmur"],
      });
      const likedMurmurIds = new Set(likes.map((like) => like.murmur.id));

      const data = await Promise.all(
        murmurs.map(async (murmur) => {
          const totalLikes = await this.likeRepo.count({
            where: { murmur: { id: murmur.id } },
          });

          return {
            ...murmur,
            isLiked: likedMurmurIds.has(murmur.id),
            totalLikes,
          };
        })
      );

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

  async getMurmurDetail(userId: number, murmurId: number) {
    try {
      const murmur = await this.murmurRepo.findOne({
        where: { id: murmurId },
        relations: ["user"],
      });
      if (!murmur) throw new NotFoundException("Murmur not found");

      const totalLikes = await this.likeRepo.count({
        where: { murmur: { id: murmurId } },
      });
      const isLiked = await this.likeRepo.find({
        where: {
          user: { id: userId },
          murmur: { id: murmurId },
        },
        relations: ["murmur"],
      });
      return { ...murmur, totalLikes,isLiked };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
