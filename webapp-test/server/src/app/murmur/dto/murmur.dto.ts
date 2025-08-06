import { IsString, IsNotEmpty, IsNumber, IsDate, IsBoolean, IsOptional, ValidateNested, IsEmail } from "class-validator";
import { Type } from "class-transformer";

class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

export class CreateMurmurDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class MurmurResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  content: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt: Date | null;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @IsBoolean()
  isLiked: boolean;

  @IsNumber()
  totalLikes: number;
}

export class CreateMurmurResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  content: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt: Date | null;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}

export class DeleteMurmurResponseDto {
  @IsString()
  message: string;
}

export class ToggleLikeResponseDto {
  @IsString()
  message: string;
}

export class MurmurListResponseDto {
  @ValidateNested({ each: true })
  @Type(() => MurmurResponseDto)
  data: MurmurResponseDto[];

  @IsNumber()
  count: number;
}

export class MurmurDetailResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  content: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt: Date | null;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @IsBoolean()
  isLiked: boolean;

  @IsNumber()
  totalLikes: number;
}
