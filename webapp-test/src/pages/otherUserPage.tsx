import { FC, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  Skeleton,
  Button,
  Pagination,
} from '@mui/material'
import { getOtherUserInfo, getUserMurmurs, followUser } from '../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import { Murmur, User } from '../utils/interfaces'

const OtherUserPage: FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

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

  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  useEffect(() => {
    if (user?.isCurrentUser) {
      navigate('/user/me')
    }
    if (user && typeof user.isFollowing === 'boolean') {
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
      {/* User info */}
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

      {/* Murmurs list */}
      {murmursLoading ? (
        <Stack spacing={3}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={80}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      ) : murmursError ? (
        <Typography color="error" sx={{ textAlign: 'center' }}>
          Failed to load user's murmurs.
        </Typography>
      ) : murmurs.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          This user hasn't posted any murmurs yet.
        </Typography>
      ) : (
        <>
          <Stack spacing={3} sx={{ mb: 4 }}>
            {murmurs.map((murmur) => (
              <Card
                key={murmur.id}
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: 'transform 0.15s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6,
                  },
                }}
                role="article"
                aria-label={`Murmur posted on ${new Date(murmur.createdAt).toLocaleDateString()}`}
                title={murmur.content}
              >
                <CardContent>
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: 'pre-line', mb: 1 }}
                  >
                    {murmur.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(murmur.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    at{' '}
                    {new Date(murmur.createdAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              size="large"
              showFirstButton
              showLastButton
              disabled={murmursLoading}
              aria-label="Murmurs pagination"
            />
          </Box>
        </>
      )}
    </Box>
  )
}

export default OtherUserPage
