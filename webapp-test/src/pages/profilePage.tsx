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
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyUserInfo, getMyMurmurs, deleteMurmur } from '../utils/api'
import MurmurList from '../components/MurmurList'
import { Murmur } from '../utils/interfaces'

const ProfilePage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [murmurs, setMurmurs] = useState<Murmur[]>([])
  const [totalPages, setTotalPages] = useState(0)

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

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

  useEffect(() => {
    if (!murmurRes) return
    setMurmurs(murmurRes.data.data)
    setTotalPages(Math.ceil(murmurRes.data.total / 10))
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
              Followers: <strong>{userRes.data.followedCount}</strong> |{' '}
              Following: <strong>{userRes.data.followCount}</strong>
            </Typography>
          </>
        )}
      </Box>

      {murmursLoading ? (
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
    </Box>
  )
}

export default ProfilePage
