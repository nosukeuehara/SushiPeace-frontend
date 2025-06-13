import { Link, useLocation, useParams } from "@tanstack/react-router";

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
    <div>
      <input type="text" value={roomUrl} readOnly />
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(roomUrl);
          alert("コピーしました");
        }}
      >
        コピー
      </button>
      <Link to="/group/$roomId" params={{ roomId }}>
        お寿司ルームへ
      </Link>
    </div>
  );
}
