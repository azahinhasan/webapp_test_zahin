import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import {
  CreateMurmurDto,
  CreateMurmurResponseDto,
  DeleteMurmurResponseDto,
  MurmurDetailResponseDto,
  MurmurListResponseDto,
  ToggleLikeResponseDto,
} from "./dto/murmur.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Follow, Like, Murmur } from "src/entities";

@Injectable()
export class MurmurService {
  constructor(
    @InjectRepository(Murmur)
    private murmurRepo: Repository<Murmur>,
    @InjectRepository(Like)
    private likeRepo: Repository<Like>,
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>
  ) {}

  async createMurmur(
    userId: number,
    dto: CreateMurmurDto
  ): Promise<CreateMurmurResponseDto> {
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

  async deleteMurmur(
    userId: number,
    murmurId: number
  ): Promise<DeleteMurmurResponseDto> {
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

  async listMurmurs(
    userId: number,
    pagination: PaginationDto
  ): Promise<MurmurListResponseDto> {
    try {
      const { page, limit } = pagination;

      const followings = await this.followRepo.find({
        where: { follower: { id: userId } },
        relations: ["following"],
      });
      const followingIds = followings.map((f) => f.following.id);

      if (followingIds.length === 0) {
        return { data: [], count: 0 };
      }

      const [murmurs, count] = await this.murmurRepo.findAndCount({
        where: {
          user: {
            id: In(followingIds),
          },
        },
        relations: ["user"],
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: "DESC" },
      });

      const data = await Promise.all(
        murmurs.map(async (murmur) => {
          const totalLikes = await this.likeRepo.count({
            where: { murmur: { id: murmur.id } },
          });

          const isLiked = await this.likeRepo.exists({
            where: {
              user: { id: userId },
              murmur: { id: murmur.id },
            },
          });

          return {
            ...murmur,
            isLiked,
            totalLikes,
          };
        })
      );

      return { data, count };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async toggleLikeMurmur(
    userId: number,
    murmurId: number
  ): Promise<ToggleLikeResponseDto> {
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
  ): Promise<MurmurListResponseDto> {
    try {
      const { page, limit } = pagination;
      let [murmurs, count] = await this.murmurRepo.findAndCount({
        where: { user: { id: otherUserId } },
        order: { createdAt: "DESC" },
        skip: (page - 1) * limit,
        take: limit,
        relations: ["user"],
      });

      const data = await Promise.all(
        murmurs.map(async (murmur) => {
          const totalLikes = await this.likeRepo.count({
            where: { murmur: { id: murmur.id } },
          });
          const isLiked = await this.likeRepo.exists({
            where: {
              user: { id: userId },
              murmur: { id: murmur.id },
            },
          });

          return {
            ...murmur,
            isLiked,
            totalLikes,
          };
        })
      );

      return { data, count };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getMurmurDetail(
    userId: number,
    murmurId: number
  ): Promise<MurmurDetailResponseDto> {
    try {
      const murmur = await this.murmurRepo.findOne({
        where: { id: murmurId },
        relations: ["user"],
      });
      if (!murmur) throw new NotFoundException("Murmur not found");

      const totalLikes = await this.likeRepo.count({
        where: { murmur: { id: murmurId } },
      });
      const isLiked = await this.likeRepo.exists({
        where: {
          user: { id: userId },
          murmur: { id: murmurId },
        },
      });

      return {
        ...murmur,
        isLiked,
        totalLikes,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
