export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  email: string
  password: string
  name:string
}


export interface LoginResponseData {
  accessToken: string
  csrfToken: string
}
export interface User {
  id: number
  name: string
  email: string
  followCount: number
  followedCount: number
}

export interface Murmur {
  id: number
  content: string
  isLiked: boolean
  user: {
    id: number
    name: string
  } | null
  createdAt: string
}

export interface MurmurResponse {
  data: Murmur[]
  count: number
}
export interface AuthResponse {
  token: string
  csrfToken: string
}

export interface PaginatedResponse<T> {
  data: T[]
  currentPage: number
  totalPages: number
}

export interface Pagination {
  page: number
  limit: number
}

export interface CreateMurmur {
  content: string
}

export interface Like {
  id: number
}

export interface Follow {
  id: number
}
