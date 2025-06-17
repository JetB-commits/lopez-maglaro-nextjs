import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const adminChat = new Hono()

// Get all chat trees
adminChat.get('/trees', async (c) => {
  const trees = await prisma.chatTree.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
        }
      },
      _count: {
        select: { nodes: true }
      }
    }
  })

  return c.json({ trees })
})

// Get chat tree details
adminChat.get('/trees/:id', async (c) => {
  const treeId = c.req.param('id')
  
  const tree = await prisma.chatTree.findUnique({
    where: { id: treeId },
    include: {
      user: true,
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

// Delete chat tree
adminChat.delete('/trees/:id', async (c) => {
  const treeId = c.req.param('id')

  try {
    await prisma.chatTree.delete({
      where: { id: treeId },
    })

    return c.json({ message: 'Chat tree deleted' })
  } catch (error) {
    return c.json({ error: 'Failed to delete chat tree' }, 500)
  }
})

export default adminChat