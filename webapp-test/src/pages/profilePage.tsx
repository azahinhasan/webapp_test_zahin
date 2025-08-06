import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Link,
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMyUserInfo,
  getMyMurmurs,
  deleteMurmur,
  followUser,
} from '../utils/api'
import MurmurList from '../components/MurmurList'
import { Murmur, User } from '../utils/interfaces'

const ProfilePage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [murmurs, setMurmurs] = useState<Murmur[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [tab, setTab] = useState(0)
  const [undoUser, setUndoUser] = useState<User | null>(null)
  const [undoTimeout, setUndoTimeout] = useState<any | null>(null)

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
      queryClient.invalidateQueries({ queryKey: ['myMurmurs', page] })
      queryClient.invalidateQueries({ queryKey: ['murmurs'] })
    },
  })

  const followMutation = useMutation({
    mutationFn: (userId: number) => followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })

  useEffect(() => {
    if (!murmurRes) return
    setMurmurs(murmurRes.data.data)
    setTotalPages(Math.ceil(murmurRes.data.count / 10))
  }, [murmurRes])

  const handleDeleteClick = (id: number) => {
    setConfirmDeleteId(id)
  }

  const confirmDelete = () => {
    if (confirmDeleteId !== null) {
      deleteMutation.mutate(confirmDeleteId)
      setConfirmDeleteId(null)
    }
  }

  const cancelDelete = () => {
    setConfirmDeleteId(null)
  }

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

  const renderFollowList = (list: User[] = []) => {
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
      <List>
        {list.map((u) => (
          <ListItem
            key={u.id}
            sx={{ border: '1px solid #ccc', m: 1, borderRadius: 2 }}
          >
            <ListItemAvatar>
              <Avatar>{u.name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Link href={`/user/${u.id}`} underline="hover" color="black">
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
                {u.isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    )
  }

  return (
    <Box sx={{ mt: 10, maxWidth: 600, mx: 'auto', px: 2 }}>
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
              Followers: <strong>{userRes.data.totalFollowed?.length}</strong> |{' '}
              Following: <strong>{userRes.data.totalFollow?.length}</strong>
            </Typography>
          </>
        )}
      </Box>

      <Tabs value={tab} onChange={(_, val) => setTab(val)} centered>
        <Tab label="Murmurs" />
        <Tab label="Following" />
        <Tab label="Followers" />
      </Tabs>

      {tab === 0 &&
        (murmursLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : murmursError || !murmurRes ? (
          <Typography variant="h6" color="error" textAlign="center" mt={5}>
            Failed to load murmurs
          </Typography>
        ) : (
          <MurmurList
            murmurs={murmurs}
            isLoading={murmursLoading}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onDelete={handleDeleteClick}
            isDeleting={deleteMutation.isPending}
            showDelete
          />
        ))}

      {tab === 1 && renderFollowList(userRes?.data?.totalFollow)}
      {tab === 2 && renderFollowList(userRes?.data?.totalFollowed)}

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
