import { IsString, IsNotEmpty } from "class-validator";

export class CreateMurmurDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export interface MurmurResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
  isLiked: boolean;
  totalLikes: number;
}

export interface CreateMurmurResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface DeleteMurmurResponseDto {
  message: string;
}

export interface ToggleLikeResponseDto {
  message: string;
}

export interface MurmurListResponseDto {
  data: MurmurResponseDto[];
  count: number;
}

export interface MurmurDetailResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
  isLiked: boolean;
  totalLikes: number;
}
