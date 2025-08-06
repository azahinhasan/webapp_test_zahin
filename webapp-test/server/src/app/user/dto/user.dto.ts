import { IsNumber, IsString, IsEmail, IsBoolean, IsOptional, ValidateNested } from "class-validator";
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

  @ValidateNested({ each: true })
  @Type(() => User)
  totalFollowed: User[];

  @ValidateNested({ each: true })
  @Type(() => User)
  totalFollow: User[];

  @IsBoolean()
  isFollowing: boolean;

  @IsBoolean()
  isCurrentUser: boolean;
}
