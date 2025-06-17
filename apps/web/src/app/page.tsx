export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Lopez Maglaro</h1>
      <p className="mt-4 text-xl">AI Chat Platform</p>
      <div className="mt-8 flex gap-4">
        <a
          href="/login"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          ログイン
        </a>
        <a
          href="/dashboard"
          className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          ダッシュボード
        </a>
      </div>
    </main>
  )
}