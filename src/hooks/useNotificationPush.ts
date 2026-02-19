import type { MemberPlates, PlateTemplate } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

const BANNER_TIMEOUT_MS = 2000;

export interface RankNotification {
  id: number;
  message: string;
}

export function useNotificationPush({
  members,
  template,
  userId,
}: {
  members: MemberPlates[];
  template: PlateTemplate | null;
  userId: string | null;
}) {
  const [rankNotifications, setRankNotifications] = useState<RankNotification[]>([]);

  const lastGroupTotal = useRef(0);
  const lastNotifiedGroup = useRef(0);
  const notificationIdRef = useRef(0);

  // タイマー管理（cleanup用）
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const pushNotification = useCallback((message: string) => {
    const id = notificationIdRef.current++;

    setRankNotifications((prev) => [{ id, message }, ...prev].slice(0, 3));

    const t = setTimeout(() => {
      setRankNotifications((prev) => prev.filter((n) => n.id !== id));
      timersRef.current.delete(id);
    }, BANNER_TIMEOUT_MS);

    timersRef.current.set(id, t);
  }, []);

  // unmount cleanup
  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      for (const t of timers.values()) clearTimeout(t);
      timers.clear();
    };
  }, []);

  useEffect(() => {
    if (!template || members.length === 0) return;

    // --- group total ---
    const total = members.reduce((sum, m) => {
      return (
        sum +
        Object.entries(m.counts).reduce((s, [color, count]) => {
          return s + count * (template.prices[color] ?? 0);
        }, 0)
      );
    }, 0);

    const groupThreshold = Math.floor(total / 1000) * 1000;

    if (total > lastGroupTotal.current) {
      if (groupThreshold > 0 && lastNotifiedGroup.current < groupThreshold) {
        pushNotification(`グループ合計が${groupThreshold.toLocaleString()}円 に到達！`);
        lastNotifiedGroup.current = groupThreshold;
      }
    } else {
      lastNotifiedGroup.current = 0;
    }
    lastGroupTotal.current = total;
  }, [members, template, userId, pushNotification]);

  return { rankNotifications };
}
