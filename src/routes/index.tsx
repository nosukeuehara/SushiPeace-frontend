import { Link } from "@tanstack/react-router";
import "./Index.css";
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
    <main className="index">
      <h1 className="index__heading">ようこそ</h1>
      <p className="index__description">回転ずしを平和に割り勘しよう</p>
      <Link to="/new" className="index__link">
        🍣 お寿司ルームを作成
      </Link>

      {history.length > 0 && (
        <div className="index__history">
          <h2 className="index__history-title">過去のルーム</h2>
          <div className="index__history-list">
            {roomHistories.map((h) => (
              <div key={h.roomId} className="index__history-item">
                <Link to="/group/$roomId" params={{ roomId: h.roomId }}>
                  <div className="index__history-group">{h.groupName}</div>
                  <div className="index__history-meta">
                    <span>
                      作成: {new Date(h.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      最終アクセス:{" "}
                      {new Date(h.lastAccessedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
                <button
                  className="index__history-remove--btn"
                  onClick={() => {
                    handleRemoveRoomHistory(h.roomId);
                  }}
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
