// このファイルは__root.tsx内に自動で描画されます。
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Link to="/new">お寿司ルーム作成</Link>
    </div>
  );
}
