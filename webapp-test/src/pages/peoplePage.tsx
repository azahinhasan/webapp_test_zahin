import {
  Box,
  Typography,
  Skeleton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  Link,
  Stack,
  Pagination,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { followUser, getAllUsers } from '../utils/api'
import { User } from '../utils/interfaces'

const PeoplePage = () => {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allUsers', page],
    queryFn: () => getAllUsers(page),
    staleTime: 1000 * 60 * 5,
  })

  const followMutation = useMutation({
    mutationFn: (userId: number) => followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] })
      queryClient.invalidateQueries({ queryKey: ['murmurs'] })
    },
  })

  const users: User[] = data?.data?.data || []
  const totalPages = data?.data?.totalPages || 1

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 8, px: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        All Users
      </Typography>

      {isLoading ? (
        <Skeleton height={400} />
      ) : isError ? (
        <Typography color="error">Failed to load users.</Typography>
      ) : (
        <>
          <List>
            {users.map((user) => (
              <Paper
                key={user.id}
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
                    <Avatar>{user.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link
                        href={
                          user.isCurrentUser
                            ? '/my-profile'
                            : `/user/${user.id}`
                        }
                        underline="hover"
                        color="black"
                      >
                        {user.name}
                      </Link>
                    }
                    secondary={user.email}
                  />
                  {!user.isCurrentUser && (
                    <Button
                      variant={user.isFollowing ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => followMutation.mutate(user.id)}
                      disabled={followMutation.isPending}
                    >
                      {user.isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </ListItem>
              </Paper>
            ))}
          </List>

          <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Stack>
        </>
      )}
    </Box>
  )
}

export default PeoplePage
