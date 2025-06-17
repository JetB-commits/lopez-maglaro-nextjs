import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

// Routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import chatRoutes from './routes/chat'
import adminRoutes from './routes/admin'
import publicRoutes from './routes/public'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())
app.use('*', prettyJSON())

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// API Routes
app.route('/api/auth', authRoutes)
app.route('/api/users', userRoutes)
app.route('/api/chat', chatRoutes)
app.route('/api/admin', adminRoutes)
app.route('/api/public', publicRoutes)

// Error handling
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

const port = process.env.PORT || 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})