import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const adminContent = new Hono()

// Manual routes
const manualSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  category: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

adminContent.get('/manuals', async (c) => {
  const manuals = await prisma.manual.findMany({
    orderBy: { order: 'asc' },
  })
  return c.json({ manuals })
})

adminContent.post('/manuals', zValidator('json', manualSchema), async (c) => {
  const data = c.req.valid('json')
  const manual = await prisma.manual.create({ data })
  return c.json({ manual }, 201)
})

adminContent.put('/manuals/:id', zValidator('json', manualSchema), async (c) => {
  const id = c.req.param('id')
  const data = c.req.valid('json')
  const manual = await prisma.manual.update({
    where: { id },
    data,
  })
  return c.json({ manual })
})

adminContent.delete('/manuals/:id', async (c) => {
  const id = c.req.param('id')
  await prisma.manual.delete({ where: { id } })
  return c.json({ message: 'Manual deleted' })
})

// News routes
const newsSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.string().optional(),
})

adminContent.get('/news', async (c) => {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return c.json({ news })
})

adminContent.post('/news', zValidator('json', newsSchema), async (c) => {
  const data = c.req.valid('json')
  const newsItem = await prisma.news.create({
    data: {
      ...data,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
    }
  })
  return c.json({ news: newsItem }, 201)
})

adminContent.put('/news/:id', zValidator('json', newsSchema), async (c) => {
  const id = c.req.param('id')
  const data = c.req.valid('json')
  const newsItem = await prisma.news.update({
    where: { id },
    data: {
      ...data,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
    }
  })
  return c.json({ news: newsItem })
})

adminContent.delete('/news/:id', async (c) => {
  const id = c.req.param('id')
  await prisma.news.delete({ where: { id } })
  return c.json({ message: 'News deleted' })
})

export default adminContent