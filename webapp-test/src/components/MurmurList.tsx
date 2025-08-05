import React from 'react'
import { Box, Pagination, Stack, Typography } from '@mui/material'
import { Murmur } from '../utils/interfaces'
import MurmurCard from './MurmurCard'

interface Props {
  murmurs: Murmur[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onLike: (id: number) => void
  isLiking: boolean
  isLoading: boolean
}

const MurmurList: React.FC<Props> = ({
  murmurs,
  currentPage,
  totalPages,
  onPageChange,
  onLike,
  isLiking,
  isLoading,
}) => {
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (murmurs.length === 0) {
    return (
      <Typography
        variant="h6"
        textAlign="center"
        mt={10}
        color="text.secondary"
      >
        No murmurs yet. Be the first to post!
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
            isLiking={isLiking}
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
