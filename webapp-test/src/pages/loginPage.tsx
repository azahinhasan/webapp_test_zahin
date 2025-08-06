import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/api'
import type { AxiosError } from 'axios'
import { LoginPayload } from '../utils/interfaces'
import Cookies from 'js-cookie'
import { Visibility, VisibilityOff } from '@mui/icons-material'
const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const mutation = useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: (res) => {
      Cookies.set('access-token', res.data.accessToken, {
        expires: 7,
        path: '/',
      })
      setErrorMsg('')
      window.location.reload()
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setErrorMsg(
        error.response?.data?.message || 'Login failed. Please try again.',
      )
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ email, password })
  }

  const handleClickShowPassword = () => setShowPassword((prev) => !prev)
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 10,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" mb={2}>
        Login
      </Typography>

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={mutation.isPending}
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          required
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={mutation.isPending}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <CircularProgress size={24} /> : 'Login'}
        </Button>
        <Button
          type="button"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/signup')}
          disabled={mutation.isPending}
        >
          Create an account
        </Button>
      </form>
    </Box>
  )
}

export default LoginPage
