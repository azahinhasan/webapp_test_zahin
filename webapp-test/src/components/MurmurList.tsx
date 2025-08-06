import React from 'react'
import { Box, Pagination, Skeleton, Stack, Typography } from '@mui/material'
import { Murmur } from '../utils/interfaces'
import MurmurCard from './MurmurCard'

interface Props {
  murmurs: Murmur[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onLike?: (id: number) => void
  isLiking?: boolean
  onDelete?: (id: number) => void
  isDeleting?: boolean
  isLoading: boolean
  showLike?: boolean
  showDelete?: boolean
}

const MurmurList: React.FC<Props> = ({
  murmurs,
  currentPage,
  totalPages,
  onPageChange,
  onLike,
  isLiking,
  onDelete,
  isDeleting,
  isLoading,
}) => {
  if (isLoading) {
    return <Skeleton variant="text" height={250} />
  }

  if (murmurs.length === 0) {
    return (
      <Typography
        variant="h6"
        textAlign="center"
        mt={10}
        color="text.secondary"
      >
        No murmurs yet.
      </Typography>
    )
  }

  return (
    <>
      <Stack spacing={3}>
        {murmurs.map((murmur) => (
          <MurmurCard
            key={murmur.id}
            murmur={murmur}
            onLike={onLike}
            isLiking={!!isLiking}
            onDelete={onDelete}
            isDeleting={!!isDeleting}
          />
        ))}
      </Stack>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => onPageChange(value)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>
    </>
  )
}

export default MurmurList
