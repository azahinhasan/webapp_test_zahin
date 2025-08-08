import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not, Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { Follow } from "../../entities/follow.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import {
  AllUserResponseDto,
  ToggleFollowResponseDto,
  UserInfoResponseDto,
} from "./dtos/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>
  ) {}

  async toggleFollowUser(
    followerId: number,
    followingId: number
  ): Promise<ToggleFollowResponseDto> {
    try {
      if (followerId === followingId)
        throw new ConflictException("Cannot follow yourself");

      const follower = await this.userRepo.findOne({
        where: { id: followerId },
      });
      const following = await this.userRepo.findOne({
        where: { id: followingId },
      });

      if (!follower || !following)
        throw new NotFoundException("User not found");

      const existingFollow = await this.followRepo.findOne({
        where: { follower: { id: followerId }, following: { id: followingId } },
      });

      if (existingFollow) {
        await this.followRepo.remove(existingFollow);
        return { message: "User unfollowed" };
      } else {
        const follow = this.followRepo.create({
          follower: { id: followerId },
          following: { id: followingId },
        });
        await this.followRepo.save(follow);
        return { message: "User followed" };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserInfo(
    userId: number,
    otherUserId: number
  ): Promise<UserInfoResponseDto> {
    try {
      const user = await this.userRepo.findOne({ where: { id: otherUserId } });
      if (!user) throw new NotFoundException("User not found");

      const followCount = await this.followRepo.count({
        where: { follower: { id: otherUserId } },
      });

      const followedCount = await this.followRepo.count({
        where: { following: { id: otherUserId } },
      });

      const isFollowing = await this.followRepo.findOne({
        where: { follower: { id: userId }, following: { id: otherUserId } },
      });

      return {
        id: user.id,
        name: user.name,
        followCount,
        followedCount,
        isFollowing: Boolean(isFollowing),
        isCurrentUser: userId === otherUserId,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getFollowers(
    userId: number,
    otherUserId: number,
    pagination: PaginationDto
  ) {
    const { page, limit } = pagination;

    const [followers, total] = await this.followRepo.findAndCount({
      where: { following: { id: otherUserId } },
      relations: ["follower"],
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = await Promise.all(
      followers.map(async (f) => {
        const isFollowing = await this.followRepo.exists({
          where: {
            follower: { id: userId },
            following: { id: f.follower.id },
          },
        });
        return {
          ...f.follower,
          isFollowing,
          isCurrentUser: userId === f.follower.id,
        };
      })
    );

    return { data, total };
  }

  async getFollowing(
    userId: number,
    otherUserId: number,
    pagination: PaginationDto
  ) {
    const { page, limit } = pagination;

    const [following, total] = await this.followRepo.findAndCount({
      where: { follower: { id: otherUserId } },
      relations: ["following"],
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = await Promise.all(
      following.map(async (f) => {
        const isFollowing = await this.followRepo.exists({
          where: {
            follower: { id: userId },
            following: { id: f.following.id },
          },
        });
        return {
          ...f.following,
          isFollowing,
          isCurrentUser: userId === f.following.id,
        };
      })
    );

    return { data, total };
  }

  async getAllUsers(
    userId: number,
    pagination: PaginationDto
  ): Promise<AllUserResponseDto> {
    const { page, limit } = pagination;

    const [users, total] = await this.userRepo.findAndCount({
      where: { id: Not(userId) },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = await Promise.all(
      users.map(async (user) => {
        const isFollowing = await this.followRepo.exists({
          where: {
            follower: { id: userId },
            following: { id: user.id },
          },
        });
        return { ...user, isFollowing };
      })
    );

    return { data, total };
  }
}
