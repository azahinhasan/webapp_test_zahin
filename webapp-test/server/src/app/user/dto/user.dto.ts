export class FollowUserDto {
  targetUserId: number;
}
export interface ToggleFollowResponseDto {
  message: string;
}

export interface UserInfoResponseDto {
  id: number;
  name: string;
  followCount: number;
  followedCount: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
}
