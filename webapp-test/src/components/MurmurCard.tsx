import React from 'react'
import {
  Avatar,
  Box,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
  Paper,
} from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { Murmur } from '../utils/interfaces'

interface Props {
  murmur: Murmur
  onLike: (id: number) => void
  isLiking: boolean
}

const MurmurCard: React.FC<Props> = ({ murmur, onLike, isLiking }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 3,
        transition: 'all 0.2s ease',
        '&:hover': { boxShadow: 3 },
      }}
    >
      <Stack direction="row" spacing={2}>
        <Avatar>{murmur.user?.name?.[0] || '?'}</Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={600}>
              {murmur.user ? (
                <Link
                  href={`/user/${murmur.user.id}`}
                  underline="hover"
                  color="primary"
                >
                  {murmur.user.name}
                </Link>
              ) : (
                'Anonymous'
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(murmur.createdAt).toLocaleString()}
            </Typography>
          </Stack>

          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', my: 1 }}>
            {murmur.content}
          </Typography>

          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
          >
            <Tooltip title={`${murmur.totalLikes} Likes`}>
              <Typography
                variant="caption"
                color={
                  murmur.totalLikes > 0 ? 'primary' : 'text.secondary'
                }
                sx={{ cursor: 'pointer',pt:.7 }}
              >
                {murmur.totalLikes}
              </Typography>
            </Tooltip>
            <IconButton
              onClick={() => onLike(murmur.id)}
              color={murmur.isLiked ? 'primary' : 'default'}
              size="small"
              disabled={isLiking}
            >
              <ThumbUpIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}

export default MurmurCard
