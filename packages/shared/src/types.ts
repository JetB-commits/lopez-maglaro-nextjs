export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminUser {
  id: string
  email: string
  username: string
  role: string
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  USER = 'USER',
  PREMIUM = 'PREMIUM',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN',
}

export interface ChatTree {
  id: string
  userId: string
  title: string
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  nodes?: ChatNode[]
  _count?: {
    nodes: number
  }
}

export interface ChatNode {
  id: string
  treeId: string
  parentId?: string
  role: 'user' | 'assistant'
  content: string
  metadata?: any
  order: number
  createdAt: string
}

export interface Purchase {
  id: string
  userId: string
  stripePaymentId: string
  amount: number
  currency: string
  status: string
  planType?: string
  metadata?: any
  createdAt: string
}

export interface News {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Manual {
  id: string
  title: string
  slug: string
  content: string
  category?: string
  order: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  question: string
  answer: string
  category?: string
  order: number
  createdAt: string
  updatedAt: string
}