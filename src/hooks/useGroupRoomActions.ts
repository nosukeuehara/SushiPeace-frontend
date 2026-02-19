import { useCallback, useEffect, useMemo, useRef } from "react";
import { emitCount, emitTemplateUpdate } from "./useSocket";
import type { MemberPlates, PlateTemplate } from "@/types";

export function useGroupRoomActions(
  roomId: string,
  members: MemberPlates[],
  template: PlateTemplate | null,
  setUserId: React.Dispatch<React.SetStateAction<string | null>>,
  setMembers: React.Dispatch<React.SetStateAction<MemberPlates[]>>,
  setTemplate: React.Dispatch<React.SetStateAction<PlateTemplate | null>>,
  lastSentSeqRef: React.RefObject<number>,
) {
  const userKey = `sushi-user-id-${roomId}`;

  // roomIdが変わったら読み直す
  useEffect(() => {
    if (!roomId) return;
    setUserId(localStorage.getItem(userKey));
  }, [roomId, setUserId, userKey]);

  const pendingDeltaRef = useRef<Record<string, number>>({});
  const flushScheduledRef = useRef(false);

  const flush = useCallback(() => {
    flushScheduledRef.current = false;

    const batch = pendingDeltaRef.current;
    pendingDeltaRef.current = {};

    for (const [k, d] of Object.entries(batch)) {
      if (d === 0) continue;
      const [uid, color] = k.split("::");
      const seq = ++lastSentSeqRef.current;
      emitCount(roomId, uid, color, d, seq);
    }
  }, [lastSentSeqRef, roomId]);

  const queueDelta = useCallback(
    (uid: string, color: string, delta: number) => {
      const key = `${uid}::${color}`;
      pendingDeltaRef.current[key] = (pendingDeltaRef.current[key] ?? 0) + delta;

      // 次のtickでまとめてflush
      if (!flushScheduledRef.current) {
        flushScheduledRef.current = true;
        queueMicrotask(flush);
      }
    },
    [flush],
  );

  const applyLocalDelta = useCallback(
    (uid: string, color: string, delta: number) => {
      setMembers((prev) =>
        prev.map((m) => {
          if (m.userId !== uid) return m;
          const current = m.counts[color] ?? 0;
          const next = Math.max(0, current + delta);
          return { ...m, counts: { ...m.counts, [color]: next } };
        }),
      );
    },
    [setMembers],
  );

  const handleSelectUser = useCallback(
    (selectedId: string) => {
      localStorage.setItem(userKey, selectedId);
      setUserId(selectedId);
    },
    [setUserId, userKey],
  );

  const handleAdd = useCallback(
    (uid: string, color: string) => {
      applyLocalDelta(uid, color, +1);
      queueDelta(uid, color, +1);
    },
    [applyLocalDelta, queueDelta],
  );

  const handleRemove = useCallback(
    (uid: string, color: string) => {
      applyLocalDelta(uid, color, -1);
      queueDelta(uid, color, -1);
    },
    [applyLocalDelta, queueDelta],
  );

  const handleUpdateTemplate = useCallback(
    (newPrices: Record<string, number>) => {
      emitTemplateUpdate(roomId, newPrices);
      setTemplate({ prices: newPrices });
    },
    [roomId, setTemplate],
  );

  const total = useMemo(() => {
    return members.reduce(
      (sum, m) =>
        sum +
        Object.entries(m.counts).reduce(
          (s, [color, count]) => s + count * (template?.prices?.[color] ?? 0),
          0,
        ),
      0,
    );
  }, [members, template]);

  return {
    total,
    handleSelectUser,
    handleAdd,
    handleRemove,
    handleUpdateTemplate,
  };
}
