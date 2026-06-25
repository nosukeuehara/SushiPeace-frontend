# SushiPals Frontend

SushiPals は、回転寿司で「誰がいくら分食べたか」をその場で記録し、個別会計と明細共有をスムーズにする Web アプリです。

友人同士の食事では、最後に皿の枚数や金額を思い出しながら精算する手間が発生しがちです。SushiPals は、ルームを作成して参加者ごとに皿をタップ記録することで、会計時の認識ずれを減らすことを目的にしています。

## Demo

- Production: https://sushi-peace.web.app/

## 主な機能

- ルーム作成
  - グループ名とメンバーを入力して会計ルームを作成
- 招待リンク共有
  - 作成したルーム URL をコピーまたは Web Share API で共有
- 参加者選択
  - 招待リンクから入ったユーザーが自分の名前を選択
- 皿データ編集
  - 金額ごとの皿を追加、編集、削除
  - 複数金額の一括登録
- 個人別カウント
  - 自分が食べた皿を金額ごとに追加、削除
  - 合計金額をリアルタイムに確認
- リアルタイム同期
  - Socket.IO によるルーム内メンバーの皿枚数・テンプレート同期
- 結果共有
  - メンバーごとの会計結果と合計金額を表示
  - 共有用テキストを生成してコピー
- ルーム履歴
  - 端末の localStorage に過去ルームを保存し、再アクセスを補助

## 使用技術

| 分類 | 技術 |
| --- | --- |
| Framework | React 19, Vite |
| Language | TypeScript |
| Routing | TanStack Router |
| Data Fetching | TanStack Query |
| Realtime | Socket.IO Client |
| Styling | Tailwind CSS |
| Test | Vitest, Testing Library, jsdom |
| Lint / Format | ESLint, Prettier |
| Hosting | Firebase Hosting |

## 設計上のポイント

### 1. 登録不要で使える導線

食事中に使うアプリとして、アカウント登録やログインを必須にすると利用開始の摩擦が大きくなります。そのため、ルーム URL と端末内の localStorage を使い、すぐに利用できる体験を優先しています。

### 2. 画面責務と状態管理の分離

ルーティングは TanStack Router の file-based routing に寄せ、画面ごとの entrypoint を `src/routes` に配置しています。データ取得は `useRoom` / `useCreateRoom` などの hooks に分離し、API 通信は `src/service` に集約しています。

```txt
src/
  components/      UI components
  domain/          UI に依存しない業務ロジック
  hooks/           page / feature hooks
  lib/             library clients
  routes/          TanStack Router routes
  service/         API / HTTP access
  types/           shared TypeScript types
  util/            small utilities
  test/            unit / component tests
```

### 3. リアルタイム同期と楽観的 UI

皿の追加・削除はローカル state に即時反映し、その後 Socket.IO で差分を送信します。短時間の連続タップは microtask でまとめて送信し、操作感を落とさないようにしています。

### 4. テストしやすい純粋関数の分離

金額計算、共有テキスト生成、ルーム履歴更新などは UI から切り離し、単体テストで確認できる形にしています。

## セットアップ

```bash
npm ci
npm run dev
```

開発サーバーはデフォルトで `http://localhost:5173` で起動します。

## 環境変数

`.env.development` または `.env.production` に以下を設定します。

```env
VITE_BASE_PATH=
VITE_API_BASE_URL=
VITE_MAINTENANCE_MODE=
```

| 変数 | 用途 |
| --- | --- |
| `VITE_BASE_PATH` | 共有 URL 生成時のベース URL |
| `VITE_API_BASE_URL` | API / Socket.IO 接続先 |
| `VITE_MAINTENANCE_MODE` | メンテナンス表示切り替え用 |

## Scripts

```bash
npm run dev       # 開発サーバー起動
npm run build     # TypeScript build + Vite production build
npm run preview   # production build の preview
npm run lint      # ESLint
npm run test      # Vitest watch
npm run test:all  # Vitest run
npm run test:ui   # Vitest UI
```

## 品質確認

現在の確認結果です。

```txt
npm run lint      -> passed
npm run test:all  -> 10 files / 23 tests passed
npm run build     -> passed
```

テストでは以下を中心に確認しています。

- 金額計算
- 共有テキスト生成
- 共有 URL 生成
- localStorage を使ったルーム履歴
- Socket hook の接続・同期イベント
- 主要ページの初期表示
- コピー操作
- 皿カウント操作コンポーネント

## ディレクトリ責務

| Directory | Responsibility |
| --- | --- |
| `src/routes` | URL と page entrypoint。画面固有のデータ取得や page component の組み立てを担当 |
| `src/components` | 表示コンポーネント。共通 UI、状態表示、ページ専用 component を含む |
| `src/hooks` | API hooks、ルーム操作、Socket 同期、通知などの React hooks |
| `src/domain` | UI や browser API に依存しない業務ロジック |
| `src/service` | HTTP request と API client |
| `src/lib` | 外部ライブラリ client の初期化 |
| `src/types` | API response や domain model の型 |
| `src/util` | 小さな utility。今後は domain / browser utility へ分割予定 |
| `src/test` | Vitest / Testing Library のテスト |

## 今後の改善予定

詳細は [plans/project-evaluation-and-improvement-plan.md](./plans/project-evaluation-and-improvement-plan.md) にまとめています。

優先度が高い改善は以下です。

- 会計データモデルの安定化
  - 現状は皿価格をカウントキーとして扱っているため、将来的には `plateId` を導入して「皿の識別子」と「価格」を分離する
- 集計ロジックの単一化
  - ルーム画面、結果画面、共有テキストで同じ計算関数を使う
- 失敗時 UX の改善
  - API、Socket、コピー、共有失敗時の画面内フィードバックを強化する
- CI の品質ゲート強化
  - PR 時に lint、test、build をまとめて実行する
- feature 単位の構成整理
  - ルーム機能専用の UI / hooks / domain logic を `features/room` へ段階的に寄せる

## このプロジェクトで意識したこと

- 実際の利用シーンに合わせ、スマートフォンで素早く操作できること
- 登録不要で開始できること
- 会計結果の納得感を高めるため、個人別の明細をすぐ共有できること
- リアルタイム同期により、複数人が同じルームを見ても状態が追従すること
- TypeScript とテストで、会計に関わるロジックを壊しにくくすること
