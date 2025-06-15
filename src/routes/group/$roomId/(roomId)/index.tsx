import { useParams } from "@tanstack/react-router";
import { useRoom } from "../../../../hooks/useRoom";
import { MemberPlateCounter } from "../../../../components/MemberPlateCounter";
import { useState, useEffect, useRef } from "react";
import type { MemberPlates, PlateTemplate } from "../../../../types/plate";
import { plateTemplates } from "../../../../constants/templates";
import { useSocket, emitCount } from "../../../../hooks/useSocket";
import { generateShareText } from "../../../../util/shareText";
import "./index.css";

const BANNER_TIMEOUT_MS = 2000; // 5秒

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
  const [showRanking, setShowRanking] = useState(false);

  const lastGroupTotal = useRef<number>(0);
  const lastPersonalTotalMap = useRef<Record<string, number>>({});
  const lastNotifiedGroup = useRef<number>(0);
  const lastNotifiedPersonal: React.RefObject<Record<string, number>> = useRef(
    {}
  );

  const getGroupThreshold = (amount: number) =>
    Math.floor(amount / 1000) * 1000;
  const getPersonalThreshold = (amount: number) =>
    Math.floor(amount / 600) * 600;

  const [rankNotifications, setRankNotifications] = useState<
    { id: number; type: "group" | "personal"; message: string }[]
  >([]);

  const notificationIdRef = useRef(0);

  const pushNotification = (type: "group" | "personal", message: string) => {
    const id = notificationIdRef.current++;
    setRankNotifications((prev) => {
      const next = [{ id, type, message }, ...prev];
      return next.slice(0, 3);
    });
    setTimeout(() => {
      setRankNotifications((prev) => prev.filter((n) => n.id !== id));
    }, BANNER_TIMEOUT_MS);
  };

  const getNextGroupThreshold = (current: number) => {
    if (current < 3000) return 3000;
    return 3000 + Math.floor((current - 3000) / 700) * 700;
  };

  const getNextPersonalThreshold = (current: number) =>
    Math.floor(current / 700) * 700;

  useSocket({
    roomId,
    userId,
    onSync: (updatedMembers) => {
      setMembers(updatedMembers);
    },
  });

  useEffect(() => {
    if (data?.members) setMembers(data.members);
    if (data?.templateId) {
      const matched = plateTemplates.find((t) => t.id === data.templateId);
      if (matched) setTemplate(matched);
    }
  }, [data]);

  useEffect(() => {
    if (!template || members.length === 0) return;

    // === グループ合計の通知 ===
    const total = members.reduce(
      (sum, m) =>
        sum +
        Object.entries(m.counts).reduce(
          (s, [color, count]) => s + count * (template.prices[color] ?? 0),
          0
        ),
      0
    );

    const totalThreshold = getGroupThreshold(total);

    const prevTotal = lastGroupTotal.current;
    const isIncreased = total > prevTotal;
    lastGroupTotal.current = total;

    if (isIncreased) {
      const groupThreshold = getNextGroupThreshold(total);
      if (
        total >= groupThreshold &&
        lastNotifiedGroup.current < groupThreshold
      ) {
        pushNotification(
          "group",
          `グループ合計が${totalThreshold.toLocaleString()}円 に到達！`
        );
        lastNotifiedGroup.current = groupThreshold;
      }
    } else if (total < lastNotifiedGroup.current) {
      // 減算時はリセットのみ（通知は出さない）
      lastNotifiedGroup.current = 0;
    }

    // === 個人合計の通知 ===
    const self = members.find((m) => m.userId === userId);
    if (self) {
      const personal = Object.entries(self.counts).reduce(
        (sum, [color, count]) => sum + count * (template.prices[color] ?? 0),
        0
      );
      const personalThreshold = getPersonalThreshold(personal);

      const prevPersonal = lastPersonalTotalMap.current[userId!] ?? 0;
      const isPersonalIncreased = personal > prevPersonal;
      lastPersonalTotalMap.current[userId!] = personal;

      if (!lastNotifiedPersonal.current[userId!]) {
        lastNotifiedPersonal.current[userId!] = 0;
      }

      if (
        isPersonalIncreased &&
        personal >= getNextPersonalThreshold(personal) &&
        lastNotifiedPersonal.current[userId!] <
          getNextPersonalThreshold(personal)
      ) {
        pushNotification(
          "personal",
          `${self.name}が${personalThreshold.toLocaleString()}円 に到達！`
        );

        lastNotifiedPersonal.current[userId!] =
          getNextPersonalThreshold(personal);
      } else if (personal < lastNotifiedPersonal.current[userId!]) {
        lastNotifiedPersonal.current[userId!] = 0;
      }
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

  const total = members.reduce(
    (sum, m) =>
      sum +
      Object.entries(m.counts).reduce(
        (s, [color, count]) => s + count * (template?.prices[color] ?? 0),
        0
      ),
    0
  );

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
      <div className="group-room group-room--select">
        <h2 className="group-room__subheading">あなたは誰ですか？</h2>
        <ul className="group-room__member-list">
          {members.map((m) => (
            <li key={m.userId}>
              <button
                className="group-room__select-button"
                onClick={() => handleSelect(m.userId)}
              >
                {m.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="group-room">
      {rankNotifications && (
        <div className="rank-banners">
          {rankNotifications.map((n) => (
            <div
              key={n.id}
              className={`rank-banner ${
                n.type === "group"
                  ? "rank-banner--group"
                  : "rank-banner--personal"
              }`}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}

      <div className="group-room__header">
        <h2>{data.groupName}</h2>
        <span className="group-room__room-id">ルームID: {roomId}</span>
      </div>

      <div className="group-room__controls">
        <button
          className="group-room__ranking-toggle"
          onClick={() => setShowRanking((prev) => !prev)}
        >
          {showRanking ? "ランキングを隠す" : "ランキングを見る"}
        </button>

        <button
          className="group-room__switch-user"
          onClick={() => {
            localStorage.removeItem(userKey);
            setUserId(null);
          }}
        >
          ユーザーを選び直す
        </button>
      </div>

      {showRanking && (
        <div className="group-room__ranking">
          <h3>🥇 食べた皿ランキング</h3>
          <ul>
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
          </ul>

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
              .sort((a, b) => {
                if (b.subtotal !== a.subtotal) return b.subtotal - a.subtotal;
                return a.originalIndex - b.originalIndex;
              })
              .slice(0, 3)
              .map((m, i) => (
                <li key={m.userId}>
                  {i + 1}位: {m.name}（{m.subtotal.toLocaleString()}円）
                </li>
              ))}
          </ul>
        </div>
      )}

      <p className="group-room__summary">
        グループ全体の合計: {total.toLocaleString()} 円
      </p>

      <div className="group-room__member-list">
        {/* 自分 */}
        {members
          .filter((m) => m.userId === userId)
          .map((m) => (
            <div key={m.userId} className="member-wrapper member-wrapper--self">
              <MemberPlateCounter
                member={m}
                onAdd={handleAdd}
                onRemove={handleRemove}
                readonly={false}
                prices={template.prices}
              />
            </div>
          ))}

        {/* 他人 */}
        {members
          .filter((m) => m.userId !== userId)
          .map((m) => (
            <div
              key={m.userId}
              className="member-wrapper member-wrapper--readonly"
            >
              <MemberPlateCounter
                member={m}
                onAdd={handleAdd}
                onRemove={handleRemove}
                readonly={true}
                prices={template.prices}
              />
            </div>
          ))}
      </div>

      <button
        className="group-room__share-button"
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
