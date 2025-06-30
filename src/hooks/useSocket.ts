import { useEffect } from "react";
import { socket } from "../lib/socket";
import type { MemberPlates } from "../types/plate";

interface UseSocketParams {
  roomId: string | undefined;
  userId: string | null;
  onSync: (members: MemberPlates[], templateData?: Record<string, number>) => void;
  onTemplateUpdate?: (templateId: string) => void;
}

export const useSocket = ({ roomId, userId, onSync, onTemplateUpdate }: UseSocketParams) => {
  useEffect(() => {
    if (!roomId || !userId) return;
    socket.connect();
    socket.emit("join", { roomId, userId });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userId]);

  useEffect(() => {
    const handleSync = (payload: { members: MemberPlates[]; templateId?: string }) => {
      onSync(payload.members);
      if (payload.templateId && onTemplateUpdate) {
        onTemplateUpdate(payload.templateId);
      }
    };

    socket.on("sync", handleSync);
    return () => {
      socket.off("sync", handleSync);
    };
  }, [onSync, onTemplateUpdate]);
};

export const emitCount = (roomId: string | undefined, userId: string, color: string, remove?: boolean) => {
  if (!roomId) return;
  socket.emit("count", { roomId, userId, color, ...(remove ? { remove } : {}) });
};

export const emitTemplateUpdate = (
  roomId: string | undefined,
  prices: Record<string, number>
) => {
  if (!roomId) return;
  socket.emit("updateTemplate", { roomId, prices });
};

