# SushiPeace

SushiPeace は、グループでの寿司会計を共有・管理するための Web アプリです。
React + TypeScript + Vite をベースにし、Socket.IO とリアルタイム同期で複数ユーザーが同じ寿司ルームを操作できます。

## サービス

https://sushi-peace.web.app/

## 概要

- ルームを作成してメンバーを招待
- 各メンバーごとの皿の枚数を入力し、金額をリアルタイム集計
- 皿の価格テンプレートを編集、追加、まとめて登録
- グループ合計の通知やランキング表示で会計状況を見える化
- 共有用リンクと結果共有テキストの生成
- 過去に作成したルーム履歴を参照／削除

## 主な機能

### ルーム作成

- `/new-sushi/` でルーム名とメンバー名を入力して作成
- メンバーは 2 人以上必要
- 作成後は共有リンク画面に遷移して、参加者に URL を共有

### ルーム画面

- `/new-sushi/group/:roomId` でルームに参加
- 現在ユーザーを選択して、そのユーザーの皿数を操作
- 他メンバーの皿数・会計状況を一覧表示
- 皿の種類や価格を編集可能
- 一括登録モードで複数価格をまとめて追加
- 共有用レシートテキストをコピーして共有

### 共有ページ

- `/new-sushi/group/:roomId/share` でルーム URL をコピー／共有
- `navigator.share` に対応していればネイティブ共有も可能

### 結果ページ

- `/new-sushi/group/:roomId/result` で会計結果を一覧表示
- 各メンバーの支払い額と合計金額を生成
- 共有用テキストをコピーして共有

## 技術スタック

- Vite
- React 19
- TypeScript
- Tailwind CSS
- @tanstack/react-query
- @tanstack/react-router
- Socket.IO クライアント
- ESLint / Prettier

## 主要なコード構成

- `src/routes/new-sushi/index.tsx` - ルーム作成ページ
- `src/routes/new-sushi/group/$roomId/(roomId)/index.tsx` - ルーム詳細ページ
- `src/routes/new-sushi/group/$roomId/(share)/share.tsx` - 共有リンクページ
- `src/routes/new-sushi/group/$roomId/(result)/result.tsx` - 結果ページ
- `src/hooks/` - API 取得／Socket 同期／グループ操作ロジック
- `src/components/page/roomPage/RoomPageContent.tsx` - ルーム画面 UI
- `src/components/page/resultPage/ResultPage.tsx` - 結果画面 UI
- `src/service/api/room.service.ts` - ルーム API 呼び出し
- `src/lib/socket.ts` - Socket.IO クライアント初期化

## 環境変数

`.env` またはホスト環境に次を設定します。

- `VITE_API_BASE_URL` - バックエンド API のベース URL
- `VITE_BASE_PATH` - アプリがサブパスで配信される場合のベースパス

## 開発

```bash
npm install
npm run dev
```

開発サーバーは通常 `http://localhost:5173` で起動します。

## ビルド

```bash
npm run build
npm run preview
```

## スクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - TypeScript ビルドと Vite ビルド
- `npm run lint` - ESLint 実行
- `npm run preview` - ビルド後のプレビュー

## 備考

- クライアントはルーム履歴を `localStorage` で保持し、過去のルームにすばやく復帰できます。
- 皿や人数の変更はリアルタイム同期され、複数参加者で同じ状態を共有できます。
- バックエンド API と Socket.IO サーバーが必要です。
