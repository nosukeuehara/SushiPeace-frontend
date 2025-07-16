import { Link } from "@tanstack/react-router";
import { getRoomHistory, removeRoomHistory } from "../util/roomHistory";
import { useState } from "react";

export const Route = createFileRoute({
  component: Index,
});

function Index() {
  const [roomHistories, setRoomHistories] = useState(getRoomHistory());

  const handleRemoveRoomHistory = (roomId: string) => {
    if (window.confirm("本当に削除しますか？")) {
      removeRoomHistory(roomId);
      setRoomHistories(getRoomHistory());
    }
  };

  return (
    <main className="p-8 m-6 text-center rounded-xl sm:max-w-[480px] sm:mx-auto sm:my-10">
      <h1 className="mb-6 text-2xl text-gray-900">ようこそ</h1>
      <p className="mb-4 text-base text-gray-600">回転ずしを平和に割り勘しよう</p>
      <Link
        to="/new"
        className="inline-block px-4 py-2 font-bold text-white bg-orange-600 rounded shadow hover:bg-orange-700"
      >
        🍣 お寿司ルームを作成
      </Link>

      {roomHistories.length > 0 && (
        <div className="mt-8">
          <h2 className="pb-2 mb-3 text-lg border-b">過去のルーム</h2>
          <div className="flex flex-col gap-3">
            {roomHistories.map((h) => (
              <div key={h.roomId} className="p-2 border rounded border-gray-300">
                <Link to="/group/$roomId" params={{ roomId: h.roomId }}>
                  <div className="mb-1 font-bold text-left">{h.groupName}</div>
                  <div className="flex flex-col items-start text-sm text-gray-700">
                    <span>作成: {new Date(h.createdAt).toLocaleDateString()}</span>
                    <span>
                      最終アクセス: {new Date(h.lastAccessedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
                <button
                  className="pt-2 text-sm text-red-600"
                  onClick={() => handleRemoveRoomHistory(h.roomId)}
                >
                  ✖ 削除する
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
