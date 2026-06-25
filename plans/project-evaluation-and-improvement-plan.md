# SushiPals プロジェクト評価・改善項目

## 評価サマリ

SushiPals は「回転寿司で誰がいくら食べたかを、その場で記録して個別会計する」という課題に絞れており、登録不要、ルーム共有、リアルタイム同期、結果共有まで主要な体験が実装されています。プロダクトの価値は明確で、利用シーンも具体的です。

一方で、会計結果の正確性を支えるデータモデルと、失敗時の UX に改善余地があります。特に皿の金額を `counts` のキーとして扱う設計は、価格編集、同額皿、集計ロジックの拡張時に破綻しやすいため、最優先で見直すべきです。

## 確認済みコマンド結果

- `npm run lint`: 成功
- `npm run test:all`: 成功、10 files / 23 tests passed
- `npm run build`: 成功
- sandbox 内では Vitest/Vite build が esbuild の `spawn EPERM` で失敗したため、通常権限で再実行して成功
- 実行後、`src/routeTree.gen.ts` に内容差分なしの改行コード変更が発生したため、生成ファイルの扱いは整理対象

## プロダクト観点の評価

### 良い点

- 回転寿司の個別会計という利用場面が明確で、機能の焦点がぶれていない。
- アカウント登録なしでルーム作成から共有まで進められるため、現場で使いやすい。
- ホーム画面に利用手順画像があり、初回ユーザーが全体像を把握しやすい。
- 過去ルーム履歴があり、同じ端末から再アクセスしやすい。

### 改善余地

- README が実質空で、開発者やレビュー担当者がプロダクト概要、セットアップ、環境変数、運用方法を把握しづらい。
- `package.json` の `name` が `vite-project` のままで、プロジェクト識別性が弱い。
- 共有 URL の生成方法が画面ごとに揺れており、本番 URL、ローカル URL、ベースパスの扱いが不明瞭。

## UX/アクセシビリティ観点の評価

### 良い点

- 主要 CTA が明確で、ルーム作成から利用開始までの導線は短い。
- 皿追加/削除ボタンには `aria-label` があり、操作内容が補足されている。
- モバイル幅を意識したレイアウトになっており、実利用シーンに合っている。

### 改善余地

- `alert` / `confirm` に依存している箇所が多く、画面内の状態表示、取り消し、アクセシブルなモーダル体験が弱い。
- コピーや Web Share API の失敗時に、ユーザーが次に何をすればよいか分かりにくい。
- 一部ボタンで `tabIndex={-1}` や `onMouseDown` / `onTouchStart` の制御があり、キーボード操作や支援技術との相性を検証したい。
- モーダルのフォーカストラップ、Escape キーでのクローズ、背景スクロール抑止が明確ではない。

## 会計正確性・データモデル観点の評価

### 良い点

- 金額計算はユーティリティ関数に分離され、基本的な単体テストも存在する。
- 皿テンプレート編集、個人別カウント、ランキング、結果共有という会計に必要な要素は揃っている。

### 改善余地

- `MemberPlates.counts` のキーが皿価格になっているため、価格編集時に「皿の識別子」と「金額」が同時に変わる。
- 同じ金額の皿を複数種類として扱えない。
- `calculateMemberAmount` は `counts` のキーを数値化して合計しており、`template.prices` との責務が分かれていない。
- 結果ページでは `template.prices[color]` を使う一方、共有テキストでは `calculateMemberAmount` を使っており、将来データ構造が変わった時に計算結果がずれるリスクがある。

## 内部品質観点の評価

### 良い点

- TypeScript strict 設定が有効で、基本的な型安全性は確保されている。
- API、Socket、hooks、components、domain の分離が進んでいる。
- TanStack Query と Router を使い、データ取得とルーティングの土台は整っている。

### 改善余地

- Socket の接続失敗、再接続中、同期遅延、競合更新の UX が薄い。
- `localStorage` の JSON parse 失敗や破損データへの防御がない。
- `console.log` / `console.error` がプロダクション動作に混ざる可能性がある。
- `isMaintenance` がコード内定数で、運用切り替えの仕組みとしては弱い。
- generated file である `src/routeTree.gen.ts` の改行コードや生成タイミングの方針が明文化されていない。

## ディレクトリ構成・責務分離観点の評価

### 良い点

- `routes`, `components`, `hooks`, `service`, `domain`, `types`, `util` が分かれており、初期段階としては読みやすい。
- API 通信は `src/service`、Socket は `src/hooks/socket` と `src/lib/socket.ts`、皿テンプレート操作は `src/domain/template` に寄せられており、責務分離の意図がある。
- TanStack Router の file-based routing に沿って画面単位の entrypoint が分かれている。
- `components/page/*` にページ専用の大きな表示コンポーネントを置いており、route component が肥大化しすぎないようにしている。

### 改善余地

- `src/components` 直下に `UserControlPanel`, `RankingSummary`, `PlateDataEditor`, `MemberSelector` などルーム機能専用のコンポーネントが多く、共通 UI と業務 UI の境界が曖昧になり始めている。
- `src/util/utils.ts` に金額計算、メンバー分割、クリップボード、URL 生成が混在しており、変更理由の異なる処理が同じファイルに集まっている。
- `src/hooks` 直下に API hooks、ルーム操作 hooks、通知 hooks、Socket 同期 hooks が並んでおり、機能単位で追う時に依存関係を把握しづらい。
- `src/domain/template` は存在するが、会計集計やルーム状態更新の domain logic は `util` や hooks 側にも分散している。
- `src/service` という名前は広く、API client、HTTP wrapper、外部通信契約のどこまでを持つのかが明文化されていない。
- `src/test` 配下にテストが集約されているため、対象コードとテストの距離があり、feature 単位の変更時に関連テストを見落としやすい。

### 推奨方針

- 今すぐ大規模な移動は行わず、会計データモデル改善や URL 生成統一などの変更タイミングで段階的に整理する。
- `src/features/room` を作り、ルーム画面専用の components、hooks、domain logic、tests を寄せる。
- `src/shared` または既存の `components/common`, `components/states`, `components/layout` には、機能非依存で再利用できる UI だけを置く。
- `src/domain` には UI や browser API に依存しない純粋な業務ロジックを置き、会計集計、皿テンプレート操作、ルーム状態更新の責務を集める。
- `src/util/utils.ts` は分割し、`shareUrl`, `clipboard`, `roomCalculation`, `memberSelection` のように変更理由ごとの小さいモジュールへ移す。
- ディレクトリ責務を README または `AGENTS.md` に短く記載し、新規ファイル配置の判断基準にする。

## テスト/CI観点の評価

### 良い点

- ユーティリティ、Socket hook、主要ページ表示、コピー処理などにテストがある。
- lint、test、build がローカルで成功する状態。

### 改善余地

- CI workflow は `npm ci && npm run build` のみで、`npm run lint` と `npm run test:all` が PR の必須検証に入っていない。
- 会計正確性の中核である価格編集、一括登録、結果ページ、共有テキストの整合性テストが不足している。
- ルーム作成のバリデーション、API 失敗時、Socket 失敗時のテストが不足している。
- `window.alert()` の未実装警告がテスト出力に出ており、テスト環境のモック整備が必要。

## 運用/SEO観点の評価

### 良い点

- `index.html` に title、description、OGP、Twitter card、canonical が設定されている。
- Firebase Hosting の SPA rewrite が設定されている。
- OGP 画像や favicon など公開用アセットが揃っている。

### 改善余地

- `twitter:site` の `@SushiPals` が実在・運用されているか確認が必要。
- font preload の `type` が `.ttf` に対して `font/woff2` になっており、正確性を確認したい。
- `maximum-scale=1` はアクセシビリティ上、ユーザーのズームを制限するため見直し対象。
- README にデプロイ先、環境変数、Firebase Hosting の運用手順がない。

## 優先度つき改善項目

### P0: 会計データモデルの安定化

- 課題: 皿価格が皿 ID として扱われており、価格編集や同額皿に弱い。
- 根拠: `src/types/plate.ts`, `src/domain/template/templateController.ts`, `src/util/utils.ts`, `src/components/page/resultPage/ResultPage.tsx`
- 改善方針: `plateId` を安定識別子として導入し、価格は `PlateTemplate` 側の属性として扱う。`MemberPlates.counts` は `Record<plateId, count>` に移行する。
- 受け入れ条件: 価格編集後も既存カウントが保持され、画面合計、結果ページ、共有テキストの金額が一致する。

### P0: 集計ロジックの単一化

- 課題: 画面ごとに集計方法が分散しており、将来のデータ構造変更時にずれるリスクがある。
- 根拠: `src/util/utils.ts`, `src/util/shareText.ts`, `src/components/page/resultPage/ResultPage.tsx`
- 改善方針: `template` と `members` を受け取って個人別・全体合計を返す集計関数に統一する。
- 受け入れ条件: ルーム画面、ランキング、結果ページ、共有テキストが同じ集計関数を使う。

### P1: 共有 URL 生成の統一

- 課題: share ページでは `VITE_BASE_PATH + pathname`、result ページでは `window.location.origin` を使っており、環境差分が出やすい。
- 根拠: `src/routes/new-sushi/group/$roomId/(share)/share.tsx`, `src/routes/new-sushi/group/$roomId/(result)/result.tsx`, `src/util/utils.ts`
- 改善方針: URL 生成ユーティリティを 1 つに統一し、本番 origin、ローカル origin、base path の扱いを明確化する。
- 受け入れ条件: share ページと result ページで同じルーム URL / 結果 URL が生成される。

### P1: 失敗時 UX の改善

- 課題: 通信、コピー、共有、Socket 接続に失敗した時の画面内フィードバックが弱い。
- 根拠: `src/service/http.service.ts`, `src/hooks/socket/useSocket.ts`, `src/routes/new-sushi/group/$roomId/(share)/share.tsx`, `src/components/CopyTextToClipboadBtn.tsx`
- 改善方針: alert ではなく画面内通知を使い、失敗理由と再試行導線を表示する。
- 受け入れ条件: API 失敗、コピー失敗、共有キャンセル、Socket 接続失敗をユーザーが認識できる。

### P1: モーダルとフォームのアクセシビリティ改善

- 課題: confirm/alert 依存、フォーカス制御、キーボード操作の扱いが不十分。
- 根拠: `src/components/modals/EditPlateModal.tsx`, `src/components/modals/BulkPlateModal.tsx`, `src/routes/new-sushi/index.tsx`, `src/components/PlateDataEditor.tsx`
- 改善方針: アプリ内モーダルに置き換え、role、aria、フォーカストラップ、Escape クローズを整える。
- 受け入れ条件: キーボードだけで皿追加、編集、削除確認、キャンセルが完了できる。

### P1: CI の品質ゲート強化

- 課題: PR workflow が build のみで、lint と test が必須検証になっていない。
- 根拠: `.github/workflows/firebase-hosting-pull-request.yml`, `.github/workflows/firebase-hosting-merge.yml`
- 改善方針: PR で `npm run lint`, `npm run test:all`, `npm run build` を実行する。
- 受け入れ条件: lint または test が失敗した PR は preview deploy 前に失敗する。

### P2: README とプロジェクトメタデータ整備

- 課題: README が空に近く、`package.json` の name も初期値のまま。
- 根拠: `README.md`, `package.json`
- 改善方針: プロダクト概要、セットアップ、環境変数、主要コマンド、デプロイ手順、テスト方法を README に記載する。`package.json` の name をプロジェクト名に合わせる。
- 受け入れ条件: 新規参加者が README だけでローカル起動、テスト、ビルドまで実行できる。

### P2: feature 単位のディレクトリ整理

- 課題: ルーム機能専用の UI、hooks、domain logic が `components`, `hooks`, `util`, `domain` に分散しており、機能単位で変更範囲を把握しづらい。
- 根拠: `src/components`, `src/hooks`, `src/util/utils.ts`, `src/domain/template`, `src/routes/new-sushi/group/$roomId`
- 改善方針: まず `src/features/room` を導入し、ルーム専用の components、hooks、domain logic、tests を段階的に移す。共通 UI は `components/common`, `components/states`, `components/layout` に残す。
- 受け入れ条件: ルーム画面に関する主要な変更対象が `features/room` 配下で追えるようになり、共通 UI と業務 UI の配置基準が README または `AGENTS.md` に明文化されている。

### P2: util と domain logic の責務整理

- 課題: `utils.ts` に金額計算、URL 生成、クリップボード、メンバー分割が混在しており、domain logic と browser utility の境界が曖昧。
- 根拠: `src/util/utils.ts`, `src/util/shareText.ts`, `src/domain/template/templateController.ts`
- 改善方針: 会計計算と皿テンプレート操作は `domain` または `features/room/domain` に寄せ、URL 生成や clipboard は browser utility として分離する。
- 受け入れ条件: 純粋関数の domain logic が UI/browser API に依存せずテストでき、`utils.ts` が汎用処理の寄せ集めになっていない。

### P2: localStorage 防御と履歴 UX 改善

- 課題: `localStorage` の JSON parse 失敗や不正データに弱い。
- 根拠: `src/util/roomHistory.ts`
- 改善方針: parse エラー時は空配列へフォールバックし、必要なら破損データを破棄する。
- 受け入れ条件: `sushi-room-history` に不正 JSON が入っていても画面がクラッシュしない。

### P2: SEO/アクセシビリティメタ情報の見直し

- 課題: viewport のズーム制限、font type、SNS メタ情報の正確性に確認余地がある。
- 根拠: `index.html`
- 改善方針: `maximum-scale=1` を外し、font preload の type を実ファイルに合わせ、SNS アカウント情報を確認する。
- 受け入れ条件: Lighthouse で viewport/accessibility 警告が減り、SNS シェア表示が期待どおりになる。

## 実装時の注意

- このファイルは改善項目の記録のみであり、ここでは実装を行わない。
- 改善実装はレビュー後に、優先度ごとに小さな PR またはコミット単位で進める。
- 会計データモデル変更はバックエンド契約に影響する可能性があるため、フロント単独で先行実装しない。
