import { useParams } from "@tanstack/react-router";
import { useRoom } from "../../../hooks/useRoom";
import { MemberPlateCounter } from "../../../components/MemberPlateCounter";
import { useState, useEffect } from "react";
import type {
  MemberPlates,
  PlateColor,
  PlateTemplate,
} from "../../../types/plate";
import { updateRoomCounts } from "../../../api/room";
import { plateTemplates } from "../../../constants/templates";

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

  const handleAdd = (userId: string, color: PlateColor) => {
    setMembers((prev) => {
      const updated = prev.map((m) =>
        m.userId === userId
          ? {
              ...m,
              counts: { ...m.counts, [color]: m.counts[color] + 1 },
            }
          : m
      );
      updateRoomCounts(roomId!, updated);
      return updated;
    });
  };

  const handleRemove = (userId: string, color: PlateColor) => {
    setMembers((prev) => {
      const updated = prev.map((m) =>
        m.userId === userId
          ? {
              ...m,
              counts: {
                ...m.counts,
                [color]: Math.max(0, m.counts[color] - 1),
              },
            }
          : m
      );
      updateRoomCounts(roomId!, updated);
      return updated;
    });
  };

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {(error as Error).message}</p>;
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
                sum + count * template.prices[color as PlateColor],
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

      <p>ルームID: {roomId}</p>
    </div>
  );
}
