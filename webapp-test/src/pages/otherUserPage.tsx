import { FC, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Typography, Skeleton, Button, Divider } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getOtherUserInfo,
  getUserMurmurs,
  followUser,
  toggleLike,
} from '../utils/api'
import { Murmur, User } from '../utils/interfaces'
import MurmurList from '../components/MurmurList'

const OtherUserPage: FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  if (!userId || isNaN(Number(userId))) {
    return (
      <Typography
        color="error"
        variant="h6"
        sx={{ mt: 10, textAlign: 'center', maxWidth: 600, mx: 'auto' }}
      >
        Invalid user ID.
      </Typography>
    )
  }

  const userIdNum = Number(userId)

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMurmurs', page] })
    },
  })
  const {
    data: userResponse,
    isPending: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ['user', userIdNum],
    queryFn: () => getOtherUserInfo(userIdNum),
    staleTime: 5 * 60 * 1000,
  })

  const {
    data: murmursResponse,
    isPending: murmursLoading,
    isError: murmursError,
  } = useQuery({
    queryKey: ['userMurmurs', userIdNum, page],
    queryFn: () => getUserMurmurs(userIdNum, page),
    staleTime: 5 * 60 * 1000,
  })

  const user: User | undefined = userResponse?.data
  const murmurs: Murmur[] = murmursResponse?.data?.data || []
  const totalPages = murmursResponse?.data?.totalPages || 1

  useEffect(() => {
    if (user?.isCurrentUser) {
      navigate('/my-profile')
    }
    if (typeof user?.isFollowing === 'boolean') {
      setIsFollowing(user.isFollowing)
    }
  }, [user])

  const followMutation = useMutation({
    mutationFn: () => followUser(userIdNum),
    onSuccess: () => {
      setIsFollowing((prev) => !prev)
      queryClient.invalidateQueries({ queryKey: ['user', userIdNum] })
    },
  })

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 8, px: 2 }}>
      {/* User Info */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        {userLoading ? (
          <>
            <Skeleton
              variant="text"
              width={220}
              height={40}
              sx={{ mx: 'auto' }}
            />
            <Skeleton
              variant="text"
              width={180}
              height={25}
              sx={{ mx: 'auto', mt: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={120}
              height={36}
              sx={{ mx: 'auto', mt: 2, borderRadius: 1 }}
            />
          </>
        ) : userError || !user ? (
          <Typography color="error" variant="h6">
            Failed to load user info.
          </Typography>
        ) : (
          <>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Followers: <strong>{user.followedCount}</strong> | Following:{' '}
              <strong>{user.followCount}</strong>
            </Typography>
            <Button
              variant={isFollowing ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => followMutation.mutate()}
              disabled={followMutation.isPending}
              sx={{ mt: 2 }}
              aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      <MurmurList
        murmurs={murmurs}
        currentPage={page}
        isLoading={murmursLoading}
        totalPages={totalPages}
        onPageChange={setPage}
        onLike={(id) => likeMutation.mutate(id)}
        isLiking={likeMutation.isPending}
      />
    </Box>
  )
}

export default OtherUserPage
