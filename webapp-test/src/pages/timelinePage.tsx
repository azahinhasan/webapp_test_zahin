import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMurmurs, toggleLike, createMurmur } from '../utils/api'
import { Murmur } from '../utils/interfaces'
import MurmurList from '../components/MurmurList'

const TimelinePage: React.FC = () => {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  const [totalPages, setTotalPages] = useState(0)
  const [murmurs, setMurmurs] = useState<Murmur[]>([])
  const [newMurmur, setNewMurmur] = useState('')

  const {
    data: response,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['murmurs', page],
    queryFn: () => getMurmurs(page),
  })

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['murmurs', page] })
    },
  })

  const postMutation = useMutation({
    mutationFn: createMurmur,
    onSuccess: () => {
      setNewMurmur('')
      queryClient.invalidateQueries({ queryKey: ['murmurs', page] })
    },
  })

  useEffect(() => {
    if (!response) return
    setMurmurs(response.data.data)
    setTotalPages(Math.ceil(response.data.count / 10))
  }, [response])

  const handlePost = () => {
    if (!newMurmur.trim()) return
    postMutation.mutate({ content: newMurmur })
  }

  return (
    <Box sx={{ mt: 10, maxWidth: 600, mx: 'auto', px: 2 }}>
      {/* Post Box */}
      <Paper elevation={2} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Stack spacing={2}>
          <TextField
            multiline
            fullWidth
            minRows={3}
            placeholder="What's on your mind?"
            value={newMurmur}
            onChange={(e) => setNewMurmur(e.target.value)}
            variant="outlined"
          />
          <Box sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              onClick={handlePost}
              disabled={postMutation.isPending || !newMurmur.trim()}
              startIcon={
                postMutation.isPending ? <SendAndArchiveIcon /> : <SendIcon />
              }
            >
              Post
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Content */}
      {isPending ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : isError || !response ? (
        <Typography variant="h6" color="error" textAlign="center" mt={10}>
          Error loading murmurs
        </Typography>
      ) : (
        <MurmurList
          murmurs={murmurs}
          isLoading={isPending}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onLike={(id) => likeMutation.mutate(id)}
          isLiking={likeMutation.isPending}
        />
      )}
    </Box>
  )
}

export default TimelinePage
