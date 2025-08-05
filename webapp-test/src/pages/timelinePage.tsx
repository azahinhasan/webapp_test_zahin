import React, { use, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Pagination,
  CircularProgress,
  Stack,
  Divider,
  Tooltip,
  Link,
} from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { getMurmurs, toggleLike } from '../utils/api'
import { Murmur } from '../utils/interfaces'

const TimelinePage: React.FC = () => {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  const [totalPages, setTotalPages] = useState(0)
  const [murmurs, setMurmurs] = useState<Murmur[]>([])

  const {
    data: response,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['murmurs', page],
    queryFn: () => getMurmurs(page),
  })

  const mutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['murmurs', page] })
    },
  })

  useEffect(() => {
    if (!response) return
    setMurmurs(response.data.data)
    setTotalPages(Math.ceil(response.data.count / 10))
  }, [response])

  if (isPending)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 10,
          minHeight: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  if (isError || !response)
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ textAlign: 'center', mt: 10, minHeight: '50vh' }}
      >
        Error loading murmurs
      </Typography>
    )

  if (!murmurs.length)
    return (
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ textAlign: 'center', mt: 10, minHeight: '50vh' }}
      >
        No murmurs yet. Be the first to post!
      </Typography>
    )

  return (
    <Box sx={{ mt: 10, maxWidth: 600, mx: 'auto', px: 2 }}>
      <Stack spacing={3}>
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
          >
            <CardContent>
              <Typography
                variant="body1"
                sx={{ mb: 1.5, whiteSpace: 'pre-line', fontWeight: 500 }}
              >
                {murmur.content}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="caption" color="text.secondary">
                  By:{' '}
                  {murmur.user ? (
                    <Link
                      href={`/user/${murmur.user.id}`}
                      underline="hover"
                      color="primary"
                      sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      {murmur.user.name}
                    </Link>
                  ) : (
                    'Anonymous'
                  )}{' '}
                  | {new Date(murmur.createdAt).toLocaleString()}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Tooltip title={`${murmur.totalLikes} Likes`}>
                    <Typography
                      variant="caption"
                      color={
                        murmur.totalLikes > 0 ? 'primary' : 'text.secondary'
                      }
                      sx={{
                        minWidth: 24,
                        textAlign: 'right',
                        fontWeight: 500,
                        paddingTop: 0.9,
                      }}
                    >
                      {murmur.totalLikes}
                    </Typography>
                  </Tooltip>
                  <IconButton
                    onClick={() => mutation.mutate(murmur.id)}
                    color={murmur.isLiked ? 'primary' : 'default'}
                    aria-label={murmur.isLiked ? 'Unlike' : 'Like'}
                    size="small"
                    disabled={mutation.isPending}
                    sx={{
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: murmur.isLiked ? '#0d47a1' : 'rgba(0,0,0,0.54)',
                      },
                    }}
                  >
                    <ThumbUpIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          shape="rounded"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  )
}

export default TimelinePage
