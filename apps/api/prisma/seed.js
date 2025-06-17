const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // テスト用の一般ユーザーを作成
  const hashedUserPassword = await bcrypt.hash('user123', 10)
  const testUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      username: 'testuser',
      password: hashedUserPassword,
      firstName: 'テスト',
      lastName: 'ユーザー',
      role: 'USER',
      isActive: true,
    },
  })

  // テスト用の管理者ユーザーを作成
  const hashedAdminPassword = await bcrypt.hash('admin123', 10)
  const testAdmin = await prisma.adminUser.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      username: 'testadmin',
      password: hashedAdminPassword,
      role: 'admin',
    },
  })

  console.log('Seed data created:')
  console.log('User:', { email: testUser.email, password: 'user123' })
  console.log('Admin:', { email: testAdmin.email, password: 'admin123' })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
