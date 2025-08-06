import { FC, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Skeleton,
  Button,
  Divider,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Link,
  Stack,
  Pagination,
  Paper,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getOtherUserInfo,
  getUserMurmurs,
  followUser,
  toggleLike,
  getFollowing,
  getFollowers,
} from '../utils/api'
import { Murmur, User } from '../utils/interfaces'
import MurmurList from '../components/MurmurList'

const OtherUserPage: FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState(0)
  const [followingPage, setFollowingPage] = useState(1)
  const [followersPage, setFollowersPage] = useState(1)
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

  const {
    data: murmursResponse,
    isPending: murmursLoading,
    isError: murmursError,
  } = useQuery({
    queryKey: ['userMurmurs', userIdNum, page],
    queryFn: () => getUserMurmurs(userIdNum, page),
    staleTime: 5 * 60 * 1000,
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

  const { data: followingResponse, isPending: followingLoading } = useQuery({
    queryKey: ['userFollowing', userIdNum, followingPage],
    queryFn: () => getFollowing(userIdNum, followingPage),
    enabled: tab === 1,
  })

  const { data: followersResponse, isPending: followersLoading } = useQuery({
    queryKey: ['userFollowers', userIdNum, followersPage],
    queryFn: () => getFollowers(userIdNum, followersPage),
    enabled: tab === 2,
  })

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMurmurs'] })
    },
  })

  const followMutation = useMutation({
    mutationFn: (userId: number) => followUser(userId),
    onSuccess: () => {
      setIsFollowing((prev) => !prev)
      queryClient.invalidateQueries({ queryKey: ['user', userIdNum] })
      queryClient.invalidateQueries({ queryKey: ['userFollowing', userIdNum] })
      queryClient.invalidateQueries({ queryKey: ['userFollowers', userIdNum] })
    },
  })

  const user = userResponse?.data
  const murmurs: Murmur[] = murmursResponse?.data?.data || []
  const totalPages = murmursResponse?.data?.totalPages || 1

  useEffect(() => {
    if (user?.isCurrentUser) navigate('/my-profile')
    if (typeof user?.isFollowing === 'boolean') {
      setIsFollowing(user.isFollowing)
    }
  }, [user])

  const renderFollowList = (
    list: User[] = [],
    currentPage: number,
    totalPages: number,
    onPageChange: (newPage: number) => void,
  ) => {
    if (!list.length) {
      return (
        <Typography
          variant="h6"
          textAlign="center"
          mt={10}
          color="text.secondary"
        >
          No user found.
        </Typography>
      )
    }

    return (
      <>
        <List>
          {list.map((u) => (
            <Paper
              key={u.id}
              elevation={1}
              sx={{
                p: 1,
                borderRadius: 3,
                transition: 'all 0.2s ease',
                mb: 1,
                '&:hover': { boxShadow: 3 },
              }}
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{u.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Link
                      href={u.isCurrentUser ? '/my-profile' : `/user/${u.id}`}
                      underline="hover"
                      color="black"
                    >
                      {u.name}
                    </Link>
                  }
                  secondary={u.email}
                />
                {!u.isCurrentUser && (
                  <Button
                    variant={u.isFollowing ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => followMutation.mutate(u.id)}
                  >
                    {u.isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </ListItem>
            </Paper>
          ))}
        </List>
        <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => onPageChange(value)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Stack>
      </>
    )
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 8, px: 2 }}>
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
              onClick={() => followMutation.mutate(userIdNum)}
              disabled={followMutation.isPending}
              sx={{ mt: 2 }}
              aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </>
        )}
      </Box>

      <Tabs value={tab} onChange={(_, val) => setTab(val)} centered>
        <Tab label="Murmurs" />
        <Tab label="Following" />
        <Tab label="Followers" />
      </Tabs>

      <Divider sx={{ mb: 4 }} />

      {tab === 0 && (
        <MurmurList
          murmurs={murmurs}
          currentPage={page}
          isLoading={murmursLoading}
          totalPages={totalPages}
          onPageChange={setPage}
          onLike={(id) => likeMutation.mutate(id)}
          isLiking={likeMutation.isPending}
        />
      )}

      {tab === 1 &&
        (followingLoading ? (
          <CircularProgress />
        ) : (
          renderFollowList(
            followingResponse?.data?.data,
            followingPage,
            followingResponse?.data?.totalPages || 1,
            setFollowingPage,
          )
        ))}

      {tab === 2 &&
        (followersLoading ? (
          <CircularProgress />
        ) : (
          renderFollowList(
            followersResponse?.data?.data,
            followersPage,
            followersResponse?.data?.totalPages || 1,
            setFollowersPage,
          )
        ))}
    </Box>
  )
}

export default OtherUserPage
