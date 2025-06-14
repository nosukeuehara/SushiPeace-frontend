import { Link, useLocation, useParams } from "@tanstack/react-router";
import "./share.css";

export const Route = createFileRoute({
  component: RouteComponent,
});

const SHARE_SUFFIX = "/share";

function RouteComponent() {
  const { pathname } = useLocation();
  const { roomId } = useParams({ strict: false });
  const basePath = import.meta.env.VITE_BASE_PATH;

  const path = pathname.endsWith(SHARE_SUFFIX)
    ? pathname.slice(0, -SHARE_SUFFIX.length)
    : pathname;

  const roomUrl = `${basePath}${path}`;

  if (!roomId) return null;

  return (
    <main className="share-room">
      <h1 className="share-room__heading">ルーム共有</h1>

      <input
        type="text"
        value={roomUrl}
        readOnly
        className="share-room__input"
      />

      <button
        className="share-room__button share-room__button--copy"
        onClick={async () => {
          await navigator.clipboard.writeText(roomUrl);
          alert("コピーしました");
        }}
      >
        リンクをコピー
      </button>

      <Link
        to="/group/$roomId"
        params={{ roomId }}
        className="share-room__link"
      >
        お寿司ルームへ移動
      </Link>
    </main>
  );
}
