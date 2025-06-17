import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const prisma = new PrismaClient()
const chat = new Hono()

// Apply auth middleware
chat.use('*', authMiddleware)

// Validation schemas
const createChatTreeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
})

const createChatNodeSchema = z.object({
  treeId: z.string(),
  parentId: z.string().optional(),
  content: z.string().min(1),
  role: z.enum(['user', 'assistant']),
})

// Get user's chat trees
chat.get('/trees', async (c) => {
  const user = c.get('user')
  
  const trees = await prisma.chatTree.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { nodes: true }
      }
    }
  })

  return c.json({ trees })
})

// Get specific chat tree with nodes
chat.get('/trees/:id', async (c) => {
  const user = c.get('user')
  const treeId = c.req.param('id')

  const tree = await prisma.chatTree.findFirst({
    where: {
      id: treeId,
      userId: user.id,
    },
    include: {
      nodes: {
        orderBy: { order: 'asc' },
      }
    }
  })

  if (!tree) {
    return c.json({ error: 'Chat tree not found' }, 404)
  }

  return c.json({ tree })
})

// Create new chat tree
chat.post('/trees', zValidator('json', createChatTreeSchema), async (c) => {
  const user = c.get('user')
  const data = c.req.valid('json')

  const tree = await prisma.chatTree.create({
    data: {
      ...data,
      userId: user.id,
    }
  })

  return c.json({ tree }, 201)
})

// Delete chat tree
chat.delete('/trees/:id', async (c) => {
  const user = c.get('user')
  const treeId = c.req.param('id')

  const tree = await prisma.chatTree.findFirst({
    where: {
      id: treeId,
      userId: user.id,
    }
  })

  if (!tree) {
    return c.json({ error: 'Chat tree not found' }, 404)
  }

  await prisma.chatTree.delete({
    where: { id: treeId }
  })

  return c.json({ message: 'Chat tree deleted' })
})

// Create chat node
chat.post('/nodes', zValidator('json', createChatNodeSchema), async (c) => {
  const user = c.get('user')
  const data = c.req.valid('json')

  // Verify tree ownership
  const tree = await prisma.chatTree.findFirst({
    where: {
      id: data.treeId,
      userId: user.id,
    }
  })

  if (!tree) {
    return c.json({ error: 'Chat tree not found' }, 404)
  }

  // Get max order
  const maxOrder = await prisma.chatNode.aggregate({
    where: { treeId: data.treeId },
    _max: { order: true }
  })

  const node = await prisma.chatNode.create({
    data: {
      ...data,
      order: (maxOrder._max.order || 0) + 1,
    }
  })

  // Update tree timestamp
  await prisma.chatTree.update({
    where: { id: data.treeId },
    data: { updatedAt: new Date() }
  })

  return c.json({ node }, 201)
})

export default chat