import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { signup } from '../utils/api'
import type { AxiosError } from 'axios'
import { SignupPayload } from '../utils/interfaces'

const SignupPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const [errorMsg, setErrorMsg] = useState('')

  const mutation = useMutation({
    mutationFn: (data: SignupPayload) => signup(data),
    onSuccess: (res) => {
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('csrfToken', res.data.csrfToken)
      setErrorMsg('')
      navigate('/login')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message
      if (Array.isArray(message)) {
        setErrorMsg(message.join('\n'))
      } else {
        setErrorMsg(message || 'Signup failed. Please try again.')
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ email, password, name })
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
        Sign up
      </Typography>

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          type="name"
          required
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={mutation.isPending}
        />
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
          type="password"
          required
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={mutation.isPending}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <CircularProgress size={24} /> : 'Signup'}
        </Button>
        <Button
          type="button"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/login')}
          disabled={mutation.isPending}
        >
          Already have an account?
        </Button>
      </form>
    </Box>
  )
}

export default SignupPage
