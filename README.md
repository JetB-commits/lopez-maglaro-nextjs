# Lopez Maglaro - Next.js + Hono

AIチャットプラットフォームをCakePHPからNext.js + Honoへ移行したプロジェクトです。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router)
- **バックエンド**: Hono
- **データベース**: PostgreSQL + Prisma
- **認証**: JWT
- **決済**: Stripe
- **キャッシュ**: Redis
- **モノレポ管理**: Turborepo

## セットアップ

1. 依存関係のインストール
```bash
pnpm install
```

2. 環境変数の設定
```bash
cp .env.example .env.local
```

3. データベースのセットアップ
```bash
docker-compose up -d
cd apps/api
pnpm prisma migrate dev
```

4. 開発サーバーの起動
```bash
pnpm dev
```

## プロジェクト構造

```
lopez-maglaro-nextjs/
├── apps/
│   ├── web/          # Next.js フロントエンド
│   └── api/          # Hono バックエンドAPI
├── packages/
│   ├── shared/       # 共有型定義・ユーティリティ
│   └── ui/           # 共有UIコンポーネント
└── docker-compose.yml
```

## 開発

- `pnpm dev` - 開発サーバーの起動
- `pnpm build` - プロダクションビルド
- `pnpm test` - テストの実行
- `pnpm lint` - ESLintの実行

## ライセンス

MIT
