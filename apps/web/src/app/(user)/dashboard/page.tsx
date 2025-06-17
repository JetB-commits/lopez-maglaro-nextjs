'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, api } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { ChatTree } from '@lopez-maglaro/shared'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [chatTrees, setChatTrees] = useState<ChatTree[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadChatTrees()
  }, [user, router])

  const loadChatTrees = async () => {
    try {
      const { data } = await api.get('/api/chat/trees')
      setChatTrees(data.trees)
    } catch (error) {
      console.error('Failed to load chat trees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.firstName} {user.lastName}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">プラン</h3>
            <p className="text-2xl font-bold text-blue-600">
              {user.role === 'PREMIUM' ? 'プレミアム' : 'フリー'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">チャット数</h3>
            <p className="text-2xl font-bold">{chatTrees.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">アカウント作成日</h3>
            <p className="text-lg">
              {format(new Date(user.createdAt), 'yyyy年MM月dd日', { locale: ja })}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">最近のチャット</h2>
            <Button onClick={() => router.push('/chat/new')}>
              新規チャット
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">読み込み中...</div>
          ) : chatTrees.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">チャットはまだありません</p>
              <Button className="mt-4" onClick={() => router.push('/chat/new')}>
                最初のチャットを開始
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイトル
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      メッセージ数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最終更新
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chatTrees.map((tree) => (
                    <tr key={tree.id} className="hover:bg-gray-50 cursor-pointer">
                      <td 
                        className="px-6 py-4 whitespace-nowrap"
                        onClick={() => router.push(`/chat/${tree.id}`)}
                      >
                        {tree.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tree._count?.nodes || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(tree.updatedAt), 'MM/dd HH:mm', { locale: ja })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/chat/${tree.id}`)}
                        >
                          開く
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}