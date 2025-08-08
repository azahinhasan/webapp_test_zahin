import React from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Avatar,
  Link,
} from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMurmurDetails, toggleLike } from '../utils/api'
import { Murmur } from '../utils/interfaces'

const MurmurDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const murmurId = Number(id)
  const queryClient = useQueryClient()

  const {
    data: murmurRes,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['murmur', murmurId],
    queryFn: () => getMurmurDetails(murmurId),
    enabled: !!murmurId,
  })

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['murmur', murmurId] })
      queryClient.invalidateQueries({ queryKey: ['murmurs'] })
    },
  })

  const murmur: Murmur | undefined = murmurRes?.data

  return (
    <Box sx={{ mt: 10, maxWidth: 600, mx: 'auto', px: 2 }}>
      {isPending ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : isError || !murmur ? (
        <Typography variant="h6" color="error" textAlign="center" mt={10}>
          Failed to load murmur details
        </Typography>
      ) : (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar>{murmur.user?.name?.[0] || '?'}</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {murmur.user ? (
                  <Link href={`/user/${murmur.user.id}`} underline="hover">
                    {murmur.user.name}
                  </Link>
                ) : (
                  'Anonymous'
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(murmur.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="body1" sx={{ mt: 3, whiteSpace: 'pre-line' }}>
            {murmur.content}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
            mt={3}
          >
            <Tooltip title={`${murmur.totalLikes} Likes`}>
              <Typography
                variant="caption"
                color={murmur.totalLikes > 0 ? 'primary' : 'text.secondary'}
                sx={{ pt: 0.5 }}
              >
                {murmur.totalLikes}
              </Typography>
            </Tooltip>
            <IconButton
              onClick={() => likeMutation.mutate(murmur.id)}
              color={murmur.isLiked ? 'primary' : 'default'}
              disabled={likeMutation.isPending}
              size="small"
            >
              <ThumbUpIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Paper>
      )}
    </Box>
  )
}

export default MurmurDetailPage
