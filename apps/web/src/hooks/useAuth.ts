'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import type { User, AdminUser } from '@lopez-maglaro/shared'

interface AuthState {
  user: User | null
  admin: AdminUser | null
  userType: 'user' | 'admin' | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  adminLogin: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  setAdmin: (admin: AdminUser | null) => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Axios instance with auth interceptor
export const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      admin: null,
      userType: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/api/auth/login', {
            email,
            password,
          })
          set({
            user: data.user,
            admin: null,
            userType: 'user',
            token: data.token,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      adminLogin: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/api/auth/admin/login', {
            email,
            password,
          })
          set({
            user: null,
            admin: data.admin,
            userType: 'admin',
            token: data.token,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await api.post('/api/auth/logout')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({ user: null, admin: null, userType: null, token: null })
        }
      },

      setUser: (user) => set({ user }),
      setAdmin: (admin) => set({ admin }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        admin: state.admin,
        userType: state.userType,
      }),
    }
  )
)