import axios from 'axios'
import { LoginPayload, SignupPayload } from './interfaces'
import Cookies from 'js-cookie'

const api_v1 = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api_v1.interceptors.request.use((config) => {
  config.headers.set('X-CSRF-Token', Cookies.get('csrf-token'))
  if (
    config.url?.endsWith('/auth/login') ||
    config.url?.endsWith('/auth/signup') ||
    config.url?.endsWith('/auth/csrf-token')
  ) {
    return config
  }

  config.headers.set('Authorization', `Bearer ${Cookies.get('access-token')}`)

  return config
})

// Auth
export const csrfToken = () => api_v1.get('/auth/csrf-token')

export const signup = (data: SignupPayload) => api_v1.post('/auth/signup', data)

export const login = (data: LoginPayload) => api_v1.post('/auth/login', data)

// Murmurs
export const createMurmur = (data: { content: string }) =>
  api_v1.post('/murmurs', data)

export const toggleLike = (id: number) =>
  api_v1.patch(`/murmurs/${id}/toggle-like`)

export const getMurmurs = (page: number) => api_v1.get(`/murmurs?page=${page}`)

export const getMurmurDetails = (id: number) => api_v1.get(`/murmurs/${id}`)

export const getMyMurmurs = (page: number) =>
  api_v1.get(`/murmurs/me?page=${page}`)

export const getUserMurmurs = (userId: number, page: number) =>
  api_v1.get(`/murmurs/user/${userId}?page=${page}`)

export const deleteMurmur = (id: number) => api_v1.delete(`/murmurs/${id}`)
// Users
export const getMyUserInfo = () => api_v1.get('/users/me')

export const getOtherUserInfo = (id: number) => api_v1.get(`/users/${id}`)

export const followUser = (id: number) => api_v1.patch(`/users/${id}/follow`)

export default api_v1
