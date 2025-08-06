import {Link, useLocation, useParams} from "@tanstack/react-router";

export const Route = createFileRoute({
  component: RouteComponent,
});

const SHARE_SUFFIX = "/share";

function RouteComponent() {
  const {pathname} = useLocation();
  const {roomId} = useParams({strict: false});
  const basePath = import.meta.env.VITE_BASE_PATH;

  const path = pathname.endsWith(SHARE_SUFFIX)
    ? pathname.slice(0, -SHARE_SUFFIX.length)
    : pathname;

  const roomUrl = `${basePath}${path}`;

  if (!roomId) return null;

  return (
    <main className="max-w-lg p-6 mx-auto my-8 text-center rounded-xl">
      <h1 className="mb-6 text-2xl">ルーム共有</h1>

      <input
        type="text"
        value={roomUrl}
        readOnly
        className="w-full p-2 mb-4 bg-gray-100 border rounded"
      />

      <button
        className="block w-full px-4 py-2 mb-2 font-bold text-neutral-100 bg-teal-500 rounded shadow hover:bg-teal-600"
        onClick={async () => {
          await navigator.clipboard.writeText(roomUrl);
          alert("コピーしました");
        }}
      >
        リンクをコピー
      </button>

      <Link
        to="/group/$roomId"
        params={{roomId}}
        className="block px-4 py-2 text-teal-700 font-bold mt-2 hover:underline"
      >
        お寿司ルームへ移動
      </Link>
    </main>
  );
}
