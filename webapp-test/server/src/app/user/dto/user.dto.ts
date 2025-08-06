export class FollowUserDto {
  targetUserId: number;
}
export interface ToggleFollowResponseDto {
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isFollowing?: boolean;
}

export interface UserInfoResponseDto {
  id: number;
  name: string;
  totalFollowed: User[];
  totalFollow: User[];
  isFollowing: boolean;
  isCurrentUser: boolean;
}
