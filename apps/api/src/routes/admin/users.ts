import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const adminUsers = new Hono()

// Get all users
adminUsers.get('/', async (c) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          chatTrees: true,
          purchases: true,
        }
      }
    }
  })

  return c.json({ users })
})

// Get specific user
adminUsers.get('/:id', async (c) => {
  const userId = c.req.param('id')
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      chatTrees: {
        orderBy: { updatedAt: 'desc' },
        take: 10,
      },
      purchases: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      }
    }
  })

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({ user })
})

// Update user
const updateUserSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['USER', 'PREMIUM', 'PARTNER', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
})

adminUsers.put('/:id', zValidator('json', updateUserSchema), async (c) => {
  const userId = c.req.param('id')
  const data = c.req.valid('json')

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    })

    return c.json({ user })
  } catch (error) {
    return c.json({ error: 'Failed to update user' }, 500)
  }
})

// Delete user
adminUsers.delete('/:id', async (c) => {
  const userId = c.req.param('id')

  try {
    await prisma.user.delete({
      where: { id: userId },
    })

    return c.json({ message: 'User deleted' })
  } catch (error) {
    return c.json({ error: 'Failed to delete user' }, 500)
  }
})

export default adminUsers