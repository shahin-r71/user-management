
export interface User {
  id: string
  email: string
  name: string
  status: 'active' | 'blocked'
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
  authId: string
  description?: string
}

export type UserWithoutDates = Omit<User, 'lastLogin' | 'createdAt' | 'updatedAt'> & {
  lastLogin: string
  createdAt: string
  updatedAt: string
}