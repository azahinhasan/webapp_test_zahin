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
  likeCount: number
  userId: number
  createdAt: string
  updatedAt: string
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

