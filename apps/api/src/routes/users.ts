import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const users = new Hono()

// Apply auth middleware to all routes
users.use('*', authMiddleware)

// Validation schemas
const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().min(3).optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
})

// Get user profile
users.get('/profile', async (c) => {
  const user = c.get('user')
  
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          chatTrees: true,
          purchases: true,
        }
      }
    }
  })

  return c.json({ user: fullUser })
})

// Update user profile
users.put('/profile', zValidator('json', updateProfileSchema), async (c) => {
  const user = c.get('user')
  const data = c.req.valid('json')

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
      }
    })

    return c.json({ user: updatedUser })
  } catch (error) {
    console.error('Update profile error:', error)
    return c.json({ error: 'Failed to update profile' }, 500)
  }
})

// Change password
users.post('/change-password', zValidator('json', changePasswordSchema), async (c) => {
  const user = c.get('user')
  const { currentPassword, newPassword } = c.req.valid('json')

  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!fullUser) {
      return c.json({ error: 'User not found' }, 404)
    }

    const isValidPassword = await bcrypt.compare(currentPassword, fullUser.password)
    if (!isValidPassword) {
      return c.json({ error: 'Current password is incorrect' }, 400)
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return c.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return c.json({ error: 'Failed to change password' }, 500)
  }
})

// Get user history
users.get('/history', async (c) => {
  const user = c.get('user')

  const chatTrees = await prisma.chatTree.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      updatedAt: true,
      _count: {
        select: { nodes: true }
      }
    }
  })

  return c.json({ history: chatTrees })
})

export default users