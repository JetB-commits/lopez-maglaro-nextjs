import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const adminLogs = new Hono()

// Get message logs
adminLogs.get('/messages', async (c) => {
  const limit = parseInt(c.req.query('limit') || '100')
  const offset = parseInt(c.req.query('offset') || '0')

  const logs = await prisma.messageLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
        }
      }
    }
  })

  const total = await prisma.messageLog.count()

  return c.json({ logs, total })
})

// Get referer logs
adminLogs.get('/referers', async (c) => {
  const limit = parseInt(c.req.query('limit') || '100')
  const offset = parseInt(c.req.query('offset') || '0')

  const logs = await prisma.refererLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })

  const total = await prisma.refererLog.count()

  return c.json({ logs, total })
})

// Get purchase logs
adminLogs.get('/purchases', async (c) => {
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
        }
      }
    }
  })

  return c.json({ purchases })
})

export default adminLogs