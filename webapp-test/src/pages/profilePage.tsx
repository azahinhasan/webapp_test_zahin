import { FC, useEffect, useState } from 'react'
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
  Snackbar,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMyUserInfo,
  getMyMurmurs,
  deleteMurmur,
  followUser,
  getFollowing,
  getFollowers,
} from '../utils/api'
import { Murmur, User } from '../utils/interfaces'
import MurmurList from '../components/MurmurList'

const ProfilePage: FC = () => {
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState(0)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [undoUser, setUndoUser] = useState<User | null>(null)
  const [undoTimeout, setUndoTimeout] = useState<any | null>(null)
  const [followingPage, setFollowingPage] = useState(1)
  const [followersPage, setFollowersPage] = useState(1)
  const queryClient = useQueryClient()

  const {
    data: userRes,
    isPending: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ['me'],
    queryFn: getMyUserInfo,
  })

  const {
    data: murmurRes,
    isPending: murmursLoading,
    isError: murmursError,
  } = useQuery({
    queryKey: ['myMurmurs', page],
    queryFn: () => getMyMurmurs(page),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMurmur,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMurmurs'] })
      queryClient.invalidateQueries({ queryKey: ['murmurs'] })
    },
  })

  const { data: followingResponse, isPending: followingLoading } = useQuery({
    queryKey: ['userFollowing', userRes?.data?.id, followingPage],
    queryFn: () => getFollowing(userRes?.data?.id, followingPage),
    enabled: tab === 1,
  })

  const { data: followersResponse, isPending: followersLoading } = useQuery({
    queryKey: ['userFollowers', userRes?.data?.id, followersPage],
    queryFn: () => getFollowers(userRes?.data?.id, followersPage),
    enabled: tab === 2,
  })

  const followMutation = useMutation({
    mutationFn: (userId: number) => followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({
        queryKey: ['userFollowing', userRes?.data?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['userFollowers', userRes?.data?.id],
      })
    },
  })

  const handleDeleteClick = (id: number) => setConfirmDeleteId(id)

  const confirmDelete = () => {
    if (confirmDeleteId !== null) {
      deleteMutation.mutate(confirmDeleteId)
      setConfirmDeleteId(null)
    }
  }

  const cancelDelete = () => setConfirmDeleteId(null)

  const handleFollowToggle = (user: User) => {
    const updatedList = userRes?.data?.totalFollow?.filter(
      (u: User) => u.id !== user.id,
    )
    setUndoUser(user)

    queryClient.setQueryData(['me'], (old: any) => {
      if (!old) return old
      return {
        ...old,
        data: {
          ...old.data,
          totalFollow: updatedList,
        },
      }
    })

    const timeout = setTimeout(() => {
      followMutation.mutate(user.id)
      setUndoUser(null)
    }, 5000)

    setUndoTimeout(timeout)
  }

  const handleUndo = () => {
    if (!undoUser) return
    if (undoTimeout) clearTimeout(undoTimeout)
    queryClient.setQueryData(['me'], (old: any) => {
      if (!old) return old
      return {
        ...old,
        data: {
          ...old.data,
          totalFollow: [...old.data.totalFollow, undoUser],
        },
      }
    })
    setUndoUser(null)
  }

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
                    onClick={() => handleFollowToggle(u)}
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

  const murmurs = murmurRes?.data?.data || []
  const totalPages = murmurRes?.data?.totalPages || 1

  return (
    <Box sx={{ mt: 10, maxWidth: 700, mx: 'auto', px: 2 }}>
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
        ) : userError || !userRes ? (
          <Typography color="error" variant="h6">
            Failed to load user info.
          </Typography>
        ) : (
          <>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {userRes.data.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Followers: <strong>{userRes.data.followedCount}</strong> |
              Following: <strong>{userRes.data.followCount}</strong>
            </Typography>
          </>
        )}
      </Box>

      <Tabs value={tab} onChange={(_, val) => setTab(val)} centered>
        <Tab label="Murmurs" />
        <Tab label="Following" />
        <Tab label="Followers" />
      </Tabs>

      <Divider sx={{ mb: 4 }} />

      {tab === 0 &&
        (murmursLoading ? (
          <CircularProgress />
        ) : murmursError ? (
          <Typography variant="h6" color="error" textAlign="center" mt={5}>
            Failed to load murmurs.
          </Typography>
        ) : (
          <MurmurList
            murmurs={murmurs}
            currentPage={page}
            totalPages={totalPages}
            isLoading={murmursLoading}
            onPageChange={setPage}
            onDelete={handleDeleteClick}
            isDeleting={deleteMutation.isPending}
            showDelete
          />
        ))}

      {tab === 1 &&
        renderFollowList(
          followingResponse?.data?.data,
          followingPage,
          followingResponse?.data?.totalPages || 1,
          setFollowingPage,
        )}
      {tab === 2 &&
        renderFollowList(
          followersResponse?.data?.data,
          followersPage,
          followersResponse?.data?.totalPages || 1,
          setFollowersPage,
        )}

      <Dialog open={confirmDeleteId !== null} onClose={cancelDelete}>
        <DialogTitle>Are you sure you want to delete this murmur?</DialogTitle>
        <DialogActions>
          <Button onClick={cancelDelete} disabled={deleteMutation.isPending}>
            No
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="outlined"
            disabled={deleteMutation.isPending}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!undoUser}
        message={`Unfollowed ${undoUser?.name}`}
        action={
          <Button
            color="primary"
            size="small"
            onClick={handleUndo}
            variant="outlined"
          >
            UNDO
          </Button>
        }
        onClose={() => setUndoUser(null)}
        autoHideDuration={5000}
      />
    </Box>
  )
}

export default ProfilePage
