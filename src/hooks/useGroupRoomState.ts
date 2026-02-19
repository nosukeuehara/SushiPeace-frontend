import { useState, useRef } from "react";
import { useSocket, emitCount, emitTemplateUpdate } from "./useSocket";
import type { MemberPlates, PlateTemplate } from "@/types";

export function useGroupRoomState(
  roomId: string,
  members: MemberPlates[],
  template: PlateTemplate | null,
  setMembers: React.Dispatch<React.SetStateAction<MemberPlates[]>>,
  setTemplate: React.Dispatch<React.SetStateAction<PlateTemplate | null>>,
) {
  const userKey = `sushi-user-id-${roomId}`;
  const [userId, setUserId] = useState<string | null>(() =>
    roomId ? localStorage.getItem(userKey) : null,
  );

  const lastSentSeqRef = useRef(0);
  const lastAppliedSeqRef = useRef(0);

  const pendingDeltaRef = useRef<Record<string, number>>({});

  useSocket({
    roomId,
    userId,
    onSync: (updatedMembers, updatedTemplateData, meta) => {
      // 自分の操作のsyncで、古いものは捨てる
      if (
        meta?.sourceUserId &&
        meta.sourceUserId === userId &&
        typeof meta.sourceSeq === "number" &&
        meta.sourceSeq < lastSentSeqRef.current
      ) {
        return;
      }

      // 追いつき管理（任意：ここで追いついたと判断できる）
      if (meta?.sourceUserId === userId && typeof meta.sourceSeq === "number") {
        lastAppliedSeqRef.current = Math.max(lastAppliedSeqRef.current, meta.sourceSeq);
      }

      setMembers(updatedMembers);
      if (updatedTemplateData) setTemplate({ prices: updatedTemplateData });
    },
  });

  const queueDelta = (userId: string, color: string, delta: number) => {
    const key = `${userId}::${color}`;
    pendingDeltaRef.current[key] = (pendingDeltaRef.current[key] ?? 0) + delta;

    const batch = pendingDeltaRef.current;
    pendingDeltaRef.current = {};

    for (const [k, d] of Object.entries(batch)) {
      if (d === 0) continue;
      const [uid, c] = k.split("::");

      const seq = ++lastSentSeqRef.current;
      emitCount(roomId, uid, c, d, seq);
    }
  };

  const applyLocalDelta = (userId: string, color: string, delta: number) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.userId !== userId) return m;
        const current = m.counts[color] ?? 0;
        const next = Math.max(0, current + delta);
        return {
          ...m,
          counts: { ...m.counts, [color]: next },
        };
      }),
    );
  };

  const handleSelectUser = (selectedId: string) => {
    localStorage.setItem(userKey, selectedId);
    setUserId(selectedId);
  };

  const handleAdd = (userId: string, color: string) => {
    applyLocalDelta(userId, color, +1);
    queueDelta(userId, color, +1);
  };

  const handleRemove = (userId: string, color: string) => {
    applyLocalDelta(userId, color, -1);
    queueDelta(userId, color, -1);
  };

  const handleUpdateTemplate = (newPrices: Record<string, number>) => {
    emitTemplateUpdate(roomId, newPrices);
    setTemplate({
      prices: newPrices,
    });
  };

  const total = members.reduce(
    (sum, m) =>
      sum +
      Object.entries(m.counts).reduce(
        (s, [color, count]) => s + count * (template?.prices?.[color] ?? 0),
        0,
      ),
    0,
  );

  return {
    userId,
    setUserId,
    total,
    handleSelectUser,
    handleAdd,
    handleRemove,
    handleUpdateTemplate,
  };
}
