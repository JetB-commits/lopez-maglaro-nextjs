import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const prisma = new PrismaClient()
const auth = new Hono()

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Helper functions
const generateToken = (user: any, type: 'user' | 'admin' = 'user'): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      type,
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// User login
auth.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json')

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.isActive) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const token = generateToken(user)

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// Admin login
auth.post('/admin/login', zValidator('json', loginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json')

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (!admin) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const token = generateToken(admin, 'admin')

    return c.json({
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
      token,
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// Logout (client-side token removal)
auth.post('/logout', authMiddleware, async (c) => {
  return c.json({ message: 'Logged out successfully' })
})

// Get current user
auth.get('/me', authMiddleware, async (c) => {
  const userType = c.get('userType')
  if (userType === 'admin') {
    const admin = c.get('admin')
    return c.json({ admin, type: 'admin' })
  } else {
    const user = c.get('user')
    return c.json({ user, type: 'user' })
  }
})

export default auth