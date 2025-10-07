import { useState, useEffect, useRef } from "react";
import { useSocket, emitCount, emitTemplateUpdate } from "./useSocket";
import { updateRoomHistory } from "../util/roomHistory";
import type { MemberPlates, PlateTemplate } from "../types/plate";
import type { RoomData } from "../types/room";

const BANNER_TIMEOUT_MS = 2000;

export function useGroupRoomState(roomId: string, data: RoomData | undefined) {
  const userKey = `sushi-user-id-${roomId}`;
  const [userId, setUserId] = useState<string | null>(() =>
    roomId ? localStorage.getItem(userKey) : null
  );

  const [members, setMembers] = useState<MemberPlates[]>([]);
  const [template, setTemplate] = useState<PlateTemplate | null>(null);
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
        const newTemplate: PlateTemplate = {
          id: "custom",
          name: "カスタムテンプレート",
          prices: updatedTemplateData,
        };
        setTemplate(newTemplate);
      }
    },
  });

  useEffect(() => {
    if (data && roomId) {
      setMembers(data.members);
      setTemplate(data.template);
      updateRoomHistory(roomId, data.groupName, data.createdAt);
    }
  }, [data, roomId]);

  // 通知管理
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

  const handleSelectUser = (selectedId: string) => {
    localStorage.setItem(userKey, selectedId);
    setUserId(selectedId);
  };

  const handleAdd = (userId: string, color: string) => {
    emitCount(roomId, userId, color);
  };

  const handleRemove = (userId: string, color: string) => {
    emitCount(roomId, userId, color, true);
  };

  const handleUpdateTemplate = (newPrices: Record<string, number>) => {
    emitTemplateUpdate(roomId, newPrices);
    setTemplate({
      id: "custom",
      name: "カスタムテンプレート",
      prices: newPrices,
    });
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

  return {
    userId,
    setUserId,
    members,
    setMembers,
    template,
    setTemplate,
    rankNotifications,
    total,
    handleSelectUser,
    handleAdd,
    handleRemove,
    handleUpdateTemplate,
  };
}
