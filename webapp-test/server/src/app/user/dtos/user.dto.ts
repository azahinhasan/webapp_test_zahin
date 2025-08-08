import {
  IsNumber,
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class FollowUserDto {
  @IsNumber()
  targetUserId: number;
}

export class ToggleFollowResponseDto {
  @IsString()
  message: string;
}

export class User {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  isFollowing?: boolean;
}

export class UserInfoResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  followedCount: number;
  @IsNumber()
  followCount: number;

  @IsBoolean()
  isFollowing: boolean;

  @IsBoolean()
  isCurrentUser: boolean;
}

export class AllUserResponseDto {
  @ValidateNested()
  @Type(() => User)
  data: User[];

  @IsNumber()
  total: number;
}
