import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const publicRoutes = new Hono()

// Get published news
publicRoutes.get('/news', async (c) => {
  const news = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
    }
  })

  return c.json({ news })
})

// Get specific news item
publicRoutes.get('/news/:slug', async (c) => {
  const slug = c.req.param('slug')
  
  const newsItem = await prisma.news.findUnique({
    where: { slug },
  })

  if (!newsItem || !newsItem.isPublished) {
    return c.json({ error: 'News not found' }, 404)
  }

  return c.json({ news: newsItem })
})

// Get introduction content
publicRoutes.get('/introduction', async (c) => {
  // TODO: Implement introduction content
  return c.json({
    title: 'Lopez Maglaro',
    content: 'AI Chat Platform',
  })
})

// Get FAQ questions
publicRoutes.get('/questions', async (c) => {
  const questions = await prisma.question.findMany({
    orderBy: { order: 'asc' },
  })

  return c.json({ questions })
})

export default publicRoutes