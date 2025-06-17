import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().min(3, 'ユーザー名は3文字以上で入力してください').optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
  newPassword: z.string().min(8, '新しいパスワードは8文字以上で入力してください'),
})

// Chat schemas
export const createChatTreeSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').max(200),
  description: z.string().optional(),
})

export const createChatNodeSchema = z.object({
  treeId: z.string(),
  parentId: z.string().optional(),
  content: z.string().min(1, 'メッセージを入力してください'),
  role: z.enum(['user', 'assistant']),
})