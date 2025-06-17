import { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface JWTPayload {
  userId: string
  email: string
  role: string
  type?: 'user' | 'admin'
}

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload

    if (decoded.type === 'admin') {
      const admin = await prisma.adminUser.findUnique({
        where: { id: decoded.userId },
      })
      if (!admin) {
        return c.json({ error: 'Admin not found' }, 401)
      }
      c.set('admin', admin)
      c.set('userType', 'admin')
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
        }
      })

      if (!user || !user.isActive) {
        return c.json({ error: 'User not found or inactive' }, 401)
      }
      c.set('user', user)
      c.set('userType', 'user')
    }

    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

export const adminMiddleware = async (c: Context, next: Next) => {
  const userType = c.get('userType')
  if (userType !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403)
  }
  await next()
}

export const premiumMiddleware = async (c: Context, next: Next) => {
  const user = c.get('user')
  if (!user || (user.role !== 'PREMIUM' && user.role !== 'ADMIN')) {
    return c.json({ error: 'Premium access required' }, 403)
  }
  await next()
}