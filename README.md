# Lopez Maglaro - Next.js + Hono

AIチャットプラットフォームをCakePHPからNext.js + Honoへ移行したプロジェクトです。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router)
- **バックエンド**: Hono
- **データベース**: PostgreSQL + Prisma
- **認証**: JWT
- **状態管理**: Zustand
- **UIコンポーネント**: Radix UI + Tailwind CSS
- **モノレポ管理**: Turborepo

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local`を編集して必要な環境変数を設定してください。

### 3. データベースのセットアップ

```bash
# Dockerでデータベースを起動
docker-compose up -d

# Prismaのセットアップ
cd apps/api
pnpm prisma generate
pnpm prisma migrate dev
```

### 4. 開発サーバーの起動

```bash
# ルートディレクトリから
pnpm dev
```

これで以下が起動します：
- Next.js: http://localhost:3000
- Hono API: http://localhost:3001

## プロジェクト構造

```
lopez-maglaro-nextjs/
├── apps/
│   ├── web/              # Next.js フロントエンド
│   │   ├── src/
│   │   │   ├── app/      # App Router
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   └── api/              # Hono バックエンドAPI
│       ├── src/
│       │   ├── routes/   # APIルート
│       │   ├── middleware/
│       │   └── index.ts
│       ├── prisma/
│       └── package.json
│
├── packages/
│   └── shared/           # 共有型定義・スキーマ
│
└── docker-compose.yml
```

## 主な機能

### ユーザー機能
- ログイン/ログアウト
- ダッシュボード
- AIチャット（ChatTree）
- プロフィール管理
- 履歴表示

### 管理者機能
- 管理者ログイン
- ユーザー管理
- コンテンツ管理（ニュース、マニュアル）
- ログ閲覧
- 統計情報

## API エンドポイント

### 認証
- `POST /api/auth/login` - ユーザーログイン
- `POST /api/auth/admin/login` - 管理者ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報

### チャット
- `GET /api/chat/trees` - チャットツリー一覧
- `POST /api/chat/trees` - 新規チャットツリー作成
- `GET /api/chat/trees/:id` - チャットツリー詳細
- `POST /api/chat/nodes` - チャットノード追加

### ユーザー
- `GET /api/users/profile` - プロフィール取得
- `PUT /api/users/profile` - プロフィール更新
- `POST /api/users/change-password` - パスワード変更
- `GET /api/users/history` - 履歴取得

### 管理者
- `GET /api/admin/users` - ユーザー一覧
- `GET /api/admin/stats` - 統計情報
- その他管理機能

## 開発コマンド

```bash
# 開発サーバー
pnpm dev

# ビルド
pnpm build

# リント
pnpm lint

# 型チェック
pnpm type-check

# データベースマイグレーション
cd apps/api && pnpm prisma migrate dev

# Prisma Studio（データベースGUI）
cd apps/api && pnpm prisma studio
```

## デプロイ

### Vercel（推奨）

1. Vercelにプロジェクトを接続
2. 環境変数を設定
3. デプロイ

### その他のプラットフォーム

- Next.js: Vercel, Netlify, AWS Amplify
- Hono API: Railway, Render, Fly.io
- データベース: Supabase, PlanetScale, Neon

## 移行に関する注意事項

このプロジェクトは元のCakePHPプロジェクトから以下の機能のみを移行しています：

- 基本的な認証機能
- ChatTree/ChatNode機能
- ユーザーダッシュボード
- 管理者機能
- ニュース/お知らせ機能

以下の機能は簡素化または削除されています：
- ユーザー登録フロー（entry, activate等）
- ChatTreeのlimit機能
- 多数の未使用コントローラー

## ライセンス

MIT
