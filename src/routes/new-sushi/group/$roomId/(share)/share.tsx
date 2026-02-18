import { Link, useLocation, useParams } from "@tanstack/react-router";

export const Route = createFileRoute({
  component: RouteComponent,
});

const SHARE_SUFFIX = "/share";

function RouteComponent() {
  const { pathname } = useLocation();
  const { roomId } = useParams({ strict: false });
  const basePath = import.meta.env.VITE_BASE_PATH;

  const path = pathname.endsWith(SHARE_SUFFIX) ? pathname.slice(0, -SHARE_SUFFIX.length) : pathname;

  const roomUrl = `${basePath}${path}`;

  if (!roomId) return null;

  return (
    <div className="max-w-lg mx-auto text-center min-h-screen px-5 py-16 bg-white">
      <h1 className="mb-6 text-xl text-gray-600">
        リンクをコピーして<br></br>すし友に共有しよう
      </h1>

      <input
        type="text"
        value={roomUrl}
        readOnly
        className="w-full p-2 mb-4 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-0"
      />

      <button
        className="block w-full px-4 py-2 mb-2 font-bold text-neutral-50 bg-teal-500 shadow"
        onClick={async () => {
          await navigator.clipboard.writeText(roomUrl);
          if (navigator.share) {
            navigator
              .share({
                title: `お寿司ルームへ招待されました`,
                text: `一緒にお寿司を楽しもう！`,
                url: `${roomUrl}`,
              })
              .catch((err) => console.error("共有に失敗しました", err));
          } else {
            alert("テキストをコピーしました！");
          }
        }}
      >
        リンクを共有
      </button>

      <Link
        to="/new-sushi/group/$roomId"
        params={{ roomId }}
        className="block px-4 py-2 text-teal-700 font-bold mt-2"
      >
        お寿司ルームへ移動
      </Link>
    </div>
  );
}
