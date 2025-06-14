// このファイルは__root.tsx内に自動で描画されます。
// Index.tsx
import { Link } from "@tanstack/react-router";
import "./Index.css";

export const Route = createFileRoute({
  component: Index,
});

function Index() {
  return (
    <main className="index">
      <h1 className="index__heading">ようこそ</h1>
      <p className="index__description">
        みんなで楽しくお寿司を割り勘しましょう
      </p>
      <Link to="/new" className="index__link">
        お寿司ルームを作成する
      </Link>
    </main>
  );
}
