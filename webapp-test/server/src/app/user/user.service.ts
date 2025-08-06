import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { Follow } from "../../entities/follow.entity";
import { ToggleFollowResponseDto, UserInfoResponseDto } from "./dto/user.dto";

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

      const followerFollows = await this.followRepo.find({
        where: { following: { id: otherUserId } },
        relations: ["follower"],
      });

      const totalFollowed = await Promise.all(
        followerFollows.map(async (f) => {
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

      const followingFollows = await this.followRepo.find({
        where: { follower: { id: otherUserId } },
        relations: ["following"],
      });

      const totalFollow = await Promise.all(
        followingFollows.map(async (f) => {
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

      const isFollowing = await this.followRepo.exists({
        where: { follower: { id: userId }, following: { id: otherUserId } },
      });

      return {
        id: user.id,
        name: user.name,
        totalFollow,
        totalFollowed,
        isFollowing,
        isCurrentUser: userId === otherUserId,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
