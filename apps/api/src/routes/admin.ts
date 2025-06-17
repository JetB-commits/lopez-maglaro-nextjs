import { Hono } from 'hono'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import adminUsersRoute from './admin/users'
import adminChatRoute from './admin/chat'
import adminContentRoute from './admin/content'
import adminLogsRoute from './admin/logs'

const admin = new Hono()

// Apply auth and admin middleware to all routes
admin.use('*', authMiddleware, adminMiddleware)

// Admin dashboard stats
admin.get('/stats', async (c) => {
  // TODO: Implement dashboard statistics
  return c.json({
    totalUsers: 0,
    activeUsers: 0,
    totalChatTrees: 0,
    totalRevenue: 0,
  })
})

// Sub-routes
admin.route('/users', adminUsersRoute)
admin.route('/chat', adminChatRoute)
admin.route('/content', adminContentRoute)
admin.route('/logs', adminLogsRoute)

export default admin