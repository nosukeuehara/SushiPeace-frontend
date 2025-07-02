import { useParams } from "@tanstack/react-router";
import { useRoom } from "../../../../hooks/useRoom";
import { MemberPlateCounter } from "../../../../components/MemberPlateCounter";
import { useState, useEffect, useRef } from "react";
import type { MemberPlates, PlateTemplate } from "../../../../types/plate";
import {
  useSocket,
  emitCount,
  emitTemplateUpdate,
} from "../../../../hooks/useSocket";
import { generateShareText } from "../../../../util/shareText";
import "./index.css";
import { updateRoomHistory } from "../../../../util/roomHistory";

const BANNER_TIMEOUT_MS = 2000;

export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = useParams({ strict: false });
  const { data, isLoading, error } = useRoom(roomId);
  const userKey = `sushi-user-id-${roomId}`;
  const [userId, setUserId] = useState<string | null>(() =>
    roomId ? localStorage.getItem(userKey) : null
  );

  const [members, setMembers] = useState<MemberPlates[]>([]);
  const [template, setTemplate] = useState<PlateTemplate | null>(null);
  const [newPlate, setNewPlate] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [showRanking, setShowRanking] = useState(false);
  const [rankNotifications, setRankNotifications] = useState<
    { id: number; type: "group" | "personal"; message: string }[]
  >([]);

  const lastGroupTotal = useRef<number>(0);
  const lastPersonalTotalMap = useRef<Record<string, number>>({});
  const lastNotifiedGroup = useRef<number>(0);
  const lastNotifiedPersonal = useRef<Record<string, number>>({});
  const notificationIdRef = useRef(0);

  const pushNotification = (type: "group" | "personal", message: string) => {
    const id = notificationIdRef.current++;
    setRankNotifications((prev) =>
      [{ id, type, message }, ...prev].slice(0, 3)
    );
    setTimeout(() => {
      setRankNotifications((prev) => prev.filter((n) => n.id !== id));
    }, BANNER_TIMEOUT_MS);
  };

  useSocket({
    roomId,
    userId,
    onSync: (updatedMembers, updatedTemplateData) => {
      setMembers(updatedMembers);
      if (updatedTemplateData) {
        setTemplate({
          id: "custom",
          name: "カスタムテンプレート",
          prices: updatedTemplateData,
        });
      }
    },
  });

  useEffect(() => {
    if (data && roomId) {
      setMembers(data.members);
      updateRoomHistory(roomId, data.groupName, data.createdAt);
    }
  }, [data, roomId]);

  useEffect(() => {
    if (!template || members.length === 0) return;

    const total = members.reduce(
      (sum, m) =>
        sum +
        Object.entries(m.counts).reduce(
          (s, [color, count]) => s + count * (template.prices[color] ?? 0),
          0
        ),
      0
    );

    const groupThreshold = Math.floor(total / 1000) * 1000;
    if (total > lastGroupTotal.current) {
      if (
        total >= groupThreshold &&
        lastNotifiedGroup.current < groupThreshold
      ) {
        pushNotification(
          "group",
          `グループ合計が${groupThreshold.toLocaleString()}円 に到達！`
        );
        lastNotifiedGroup.current = groupThreshold;
      }
    } else {
      lastNotifiedGroup.current = 0;
    }
    lastGroupTotal.current = total;

    const self = members.find((m) => m.userId === userId);
    if (self) {
      const personalTotal = Object.entries(self.counts).reduce(
        (s, [color, count]) => s + count * (template.prices[color] ?? 0),
        0
      );
      const personalThreshold = Math.floor(personalTotal / 600) * 600;

      const prev = lastPersonalTotalMap.current[userId!] ?? 0;
      if (personalTotal > prev) {
        if (
          personalTotal >= personalThreshold &&
          (lastNotifiedPersonal.current[userId!] ?? 0) < personalThreshold
        ) {
          pushNotification(
            "personal",
            `${self.name}が${personalThreshold.toLocaleString()}円 に到達！`
          );
          lastNotifiedPersonal.current[userId!] = personalThreshold;
        }
      } else {
        lastNotifiedPersonal.current[userId!] = 0;
      }

      lastPersonalTotalMap.current[userId!] = personalTotal;
    }
  }, [members, template, userId]);

  const handleSelect = (selectedId: string) => {
    localStorage.setItem(userKey, selectedId);
    setUserId(selectedId);
  };

  const handleAdd = (userId: string, color: string) => {
    emitCount(roomId, userId, color);
  };

  const handleRemove = (userId: string, color: string) => {
    emitCount(roomId, userId, color, true);
  };

  const handleAddPlate = () => {
    const color = newPlate.trim();
    if (!color || newPrice <= 0) return;

    const currentPrices = template?.prices ?? {};
    const updatedPrices = { ...currentPrices, [color]: newPrice };

    emitTemplateUpdate(roomId, updatedPrices);
    setTemplate({
      id: "custom",
      name: "カスタムテンプレート",
      prices: updatedPrices,
    });
    setNewPlate("");
    setNewPrice(0);
  };

  const handleEditPlate = (color: string, newPrice: number) => {
    const currentPrices = template?.prices ?? {};
    const updatedPrices = { ...currentPrices, [color]: newPrice };

    emitTemplateUpdate(roomId, updatedPrices);
    setTemplate({
      id: "custom",
      name: "カスタムテンプレート",
      prices: updatedPrices,
    });
  };

  const handleRemovePlate = (color: string) => {
    const updatedPrices = { ...template!.prices };
    delete updatedPrices[color];
    emitTemplateUpdate(roomId, updatedPrices);
  };

  const total = members.reduce(
    (sum, m) =>
      sum +
      Object.entries(m.counts).reduce(
        (s, [color, count]) => s + count * (template?.prices?.[color] ?? 0),
        0
      ),
    0
  );

  if (isLoading) return <p>読み込み中...</p>;

  if (error) {
    return (
      <div>
        <p>エラーが発生しました: {(error as Error).message}</p>
      </div>
    );
  }

  if (!data) return <p>データが存在しません</p>;

  if (!userId) {
    return (
      <div className="group-room group-room--select">
        <h2 className="group-room__subheading">あなたは誰ですか？</h2>
        <ul className="group-room__member-list">
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
    <div className="group-room">
      {rankNotifications.length > 0 && (
        <div className="rank-banners">
          {rankNotifications.map((n) => (
            <div key={n.id} className={`rank-banner rank-banner--${n.type}`}>
              {n.message}
            </div>
          ))}
        </div>
      )}

      <div className="group-room__header">
        <h2>{data.groupName}</h2>
        <span>ルームID: {roomId}</span>
      </div>

      <div className="group-room__controls">
        <button onClick={() => setShowRanking((prev) => !prev)}>
          ランキング
        </button>
        <button
          onClick={() => {
            localStorage.removeItem(userKey);
            setUserId(null);
          }}
        >
          ユーザーを選び直す
        </button>
      </div>

      {showRanking && template?.prices && (
        <div>
          <h3>💰 金額ランキング</h3>
          <ul>
            {[...members]
              .map((m, idx) => {
                const subtotal = Object.entries(m.counts).reduce(
                  (sum, [color, count]) =>
                    sum + count * (template.prices[color] ?? 0),
                  0
                );
                return { ...m, subtotal, originalIndex: idx };
              })
              .sort((a, b) => b.subtotal - a.subtotal)
              .slice(0, 3)
              .map((m, i) => (
                <li key={m.userId}>
                  {i + 1}位: {m.name}（{m.subtotal.toLocaleString()}円）
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className="group-accountant">
        <p className="group-accountant__price">
          合計：{total.toLocaleString()} 円
        </p>
      </div>
      <div className="group-room__template-editor">
        <h3>皿の設定</h3>

        {template && (
          <ul>
            {Object.entries(template.prices).map(([color, price]) => (
              <li key={color}>
                <span>{color}</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    handleEditPlate(color, Number(e.target.value))
                  }
                />
                <button onClick={() => handleRemovePlate(color)}>削除</button>
              </li>
            ))}
          </ul>
        )}

        <input
          placeholder="新しい皿"
          value={newPlate}
          onChange={(e) => setNewPlate(e.target.value)}
        />
        <input
          placeholder="金額"
          type="text"
          value={newPrice}
          onChange={(e) => setNewPrice(Number(e.target.value))}
        />
        <button onClick={handleAddPlate}>追加</button>
      </div>

      <div className="group-room__member-list">
        {members.map((m) => (
          <div
            key={m.userId}
            className={`member-wrapper ${
              m.userId === userId
                ? "member-wrapper--self"
                : "member-wrapper--readonly"
            }`}
          >
            <MemberPlateCounter
              member={m}
              onAdd={handleAdd}
              onRemove={handleRemove}
              readonly={m.userId !== userId}
              prices={template?.prices ?? {}}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          const text = generateShareText(
            data.groupName,
            members,
            template?.prices ?? {},
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
            alert("テキストをコピーしました！");
          }
        }}
      >
        📤 会計を共有する
      </button>
    </div>
  );
}
