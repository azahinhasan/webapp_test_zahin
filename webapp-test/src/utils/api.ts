import axios from 'axios'

const api_v1 = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth
export const signup = (data: { email: string; password: string }) =>
  api_v1.post('/auth/signup', data)

export const login = (data: { email: string; password: string }) =>
  api_v1.post('/auth/login', data)

// Murmurs
export const createMurmur = (data: { content: string }) =>
  api_v1.post('/murmurs', data)

export const toggleLike = (id: number) =>
  api_v1.patch(`/murmurs/${id}/toggle-like`)

export const getMurmurs = (page: number) => api_v1.get(`/murmurs?page=${page}`)

export const getMurmurDetails = (id: number) => api_v1.get(`/murmurs/${id}`)

export const getMyMurmurs = (page: number) =>
  api_v1.get(`/murmurs/me?page=${page}`)

export const getUserMurmurs = (userId: number) =>
  api_v1.get(`/murmurs/user/${userId}`)

// Users
export const getMyUserInfo = () => api_v1.get('/users/me')

export const getOtherUserInfo = (id: number) => api_v1.get(`/users/${id}`)

export const followUser = (id: number) => api_v1.patch(`/users/${id}/follow`)

export default api_v1;
