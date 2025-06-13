import { useParams } from "@tanstack/react-router";
import { useRoom } from "../../../hooks/useRoom";
import { MemberPlateCounter } from "../../../components/MemberPlateCounter";
import { useState, useEffect } from "react";
import type { MemberPlates, PlateTemplate } from "../../../types/plate";
import { plateTemplates } from "../../../constants/templates";
import { socket } from "../../../lib/socket";
import { generateShareText } from "../../../util/shareText";

export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = useParams({ strict: false });
  const { data, isLoading, error } = useRoom(roomId);
  const [members, setMembers] = useState<MemberPlates[]>([]);
  const userKey = `sushi-user-id-${roomId}`;
  const [userId, setUserId] = useState<string | null>(() =>
    roomId ? localStorage.getItem(userKey) : null
  );
  const [template, setTemplate] = useState<PlateTemplate | null>(null);

  useEffect(() => {
    if (data?.members) {
      setMembers(data.members);
    }
    if (data?.templateId) {
      const matched = plateTemplates.find((t) => t.id === data.templateId);
      if (matched) setTemplate(matched);
    }
  }, [data]);

  const handleSelect = (selectedId: string) => {
    localStorage.setItem(userKey, selectedId);
    setUserId(selectedId);
  };

  useEffect(() => {
    if (!roomId || !userId) return;

    socket.connect();
    socket.emit("join", { roomId, userId });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userId]);

  useEffect(() => {
    socket.on("sync", (updatedMembers: MemberPlates[]) => {
      setMembers(updatedMembers);
    });

    return () => {
      socket.off("sync");
    };
  }, []);

  const handleAdd = (userId: string, color: string) => {
    if (!roomId) return;
    socket.emit("count", { roomId, userId, color });
  };

  const handleRemove = (userId: string, color: string) => {
    if (!roomId) return;
    socket.emit("count", { roomId, userId, color, remove: true });
  };

  if (isLoading) return <p>読み込み中...</p>;
  if (error) {
    const message = (error as Error).message;
    return (
      <div>
        <p>エラーが発生しました: {message}</p>
        {message.includes("有効期限") && (
          <p>
            ルームの有効期限が切れています。新しいルームを作成してください。
          </p>
        )}
      </div>
    );
  }
  if (!data) return <p>データが存在しません</p>;
  if (!template) return <p>テンプレートが見つかりません</p>;

  if (!userId) {
    return (
      <div>
        <h2>あなたは誰ですか？</h2>
        <ul>
          {members.map((m) => (
            <li key={m.userId}>
              <button onClick={() => handleSelect(m.userId)}>{m.name}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h2>🍣 グループ名: {data.groupName}</h2>
      <span>ルームID: {roomId}</span>

      <h3>🥇 食べた皿ランキング</h3>
      <ol>
        {[...members]
          .map((m) => ({
            ...m,
            totalCount: Object.values(m.counts).reduce((a, b) => a + b, 0),
          }))
          .sort((a, b) => b.totalCount - a.totalCount)
          .slice(0, 3)
          .map((m, i) => (
            <li key={m.userId}>
              {i + 1}位: {m.name}（{m.totalCount}皿）
            </li>
          ))}
      </ol>

      <h3>💰 金額ランキング</h3>
      <ol>
        {[...members]
          .map((m, idx) => {
            const subtotal = Object.entries(m.counts).reduce(
              (sum, [color, count]) =>
                sum + count * (template.prices[color as string] ?? 0),
              0
            );
            return { ...m, subtotal, originalIndex: idx };
          })
          .sort((a, b) => {
            if (b.subtotal !== a.subtotal) {
              return b.subtotal - a.subtotal;
            }
            return a.originalIndex - b.originalIndex; // タイブレーク：先に現れた人
          })
          .slice(0, 3)
          .map((m, i) => (
            <li key={m.userId}>
              {i + 1}位: {m.name}（{m.subtotal.toLocaleString()}円）
            </li>
          ))}
      </ol>

      <button
        onClick={() => {
          localStorage.removeItem(userKey);
          setUserId(null);
        }}
      >
        🔄 ユーザーを選び直す
      </button>

      <p>
        🧾 グループ全体の合計:{" "}
        {members.reduce(
          (total, m) =>
            total +
            Object.entries(m.counts).reduce(
              (sum, [color, count]) =>
                sum + count * template.prices[color as string],
              0
            ),
          0
        )}{" "}
        円
      </p>

      {members.map((m) => (
        <MemberPlateCounter
          key={m.userId}
          member={m}
          onAdd={handleAdd}
          onRemove={handleRemove}
          readonly={m.userId !== userId}
          prices={template.prices}
        />
      ))}

      <button
        onClick={() => {
          const text = generateShareText(
            data.groupName,
            members,
            template.prices,
            window.location.href
          );

          if (navigator.share) {
            navigator
              .share({
                title: `${data.groupName}の会計`,
                text,
                url: `${window.location.href}/result`,
              })
              .catch((err) => console.error("共有に失敗しました", err));
          } else {
            navigator.clipboard.writeText(text);
            alert(
              "共有機能が使えないため、テキストをクリップボードにコピーしました！"
            );
          }
        }}
      >
        📤 会計を共有する
      </button>
    </div>
  );
}
