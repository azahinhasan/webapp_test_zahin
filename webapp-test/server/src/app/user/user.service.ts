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

      const followCount = await this.followRepo.count({
        where: { follower: { id: otherUserId } },
      });
      const followedCount = await this.followRepo.count({
        where: { following: { id: otherUserId } },
      });

      const isFollowing = await this.followRepo.exists({
        where: { follower: { id: userId }, following: { id: otherUserId } },
      });

      return {
        id: user.id,
        name: user.name,
        followCount,
        followedCount,
        isFollowing,
        isCurrentUser: userId === otherUserId,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
