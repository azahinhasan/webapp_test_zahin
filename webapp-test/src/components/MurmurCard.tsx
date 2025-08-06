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
import DeleteIcon from '@mui/icons-material/Delete'
import { Murmur } from '../utils/interfaces'

interface Props {
  murmur: Murmur
  onLike?: (id: number) => void
  isLiking?: boolean
  onDelete?: (id: number) => void
  isDeleting?: boolean
  showFullText?: boolean
}

const MurmurCard: React.FC<Props> = ({
  murmur,
  onLike,
  isLiking = false,
  onDelete,
  isDeleting = false,
  showFullText = false,
}) => {
  const truncatedContent =
    murmur.content.length > 90
      ? murmur.content.slice(0, 90) + '...'
      : murmur.content

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
            <Typography sx={{ mt: 0.85, fontSize: '16px', fontWeight: 'bold' }}>
              {murmur.user ? (
                <Link
                  href={`/user/${murmur.user.id}`}
                  underline="hover"
                  color="black"
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

          <Box sx={{ my: 1 }}>
            <Typography
              variant="body1"
              sx={{ whiteSpace: 'pre-line', display: 'inline' }}
            >
              {showFullText ? murmur.content : truncatedContent}
            </Typography>
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Link href={`/murmur/${murmur.id}`} underline="hover">
              View Details
            </Link>

            <Stack direction="row" alignItems="center" spacing={1}>
              {onLike && (
                <>
                  <Tooltip title={`${murmur.totalLikes} Likes`}>
                    <Typography
                      variant="caption"
                      color={
                        murmur.totalLikes > 0 ? 'primary' : 'text.secondary'
                      }
                      sx={{ cursor: 'pointer', pt: 0.7 }}
                    >
                      {murmur.totalLikes}
                    </Typography>
                  </Tooltip>
                  <IconButton
                    onClick={() => onLike?.(murmur.id)}
                    color={murmur.isLiked ? 'primary' : 'default'}
                    size="small"
                    disabled={isLiking}
                  >
                    <ThumbUpIcon fontSize="small" />
                  </IconButton>
                </>
              )}

              {onDelete && (
                <IconButton
                  onClick={() => onDelete?.(murmur.id)}
                  color="error"
                  size="small"
                  disabled={isDeleting}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}

export default MurmurCard
